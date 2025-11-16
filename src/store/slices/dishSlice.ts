import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Dish } from '../../types';
import * as dishService from '../../services/dishService';

interface DishState {
  dishes: Dish[];
  currentDish: Dish | null;
  currentRestaurantId: string | null; // ID текущего ресторана, меню которого загружено
  isLoading: boolean;
  error: string | null;
}

const initialState: DishState = {
  dishes: [],
  currentDish: null,
  currentRestaurantId: null,
  isLoading: false,
  error: null,
};

export const fetchRestaurantMenu = createAsyncThunk(
  'dishes/fetchMenu',
  async (restaurantId: string, { rejectWithValue }) => {
    try {
      console.log('🍽️ fetchRestaurantMenu вызван с restaurantId:', restaurantId);
      const dishes = await dishService.getRestaurantMenu(restaurantId);
      console.log('✅ fetchRestaurantMenu получил блюд:', dishes.length);
      
      // Проверяем что все блюда принадлежат этому ресторану
      const wrongDishes = dishes.filter(d => d.restaurantId !== restaurantId);
      if (wrongDishes.length > 0) {
        console.error('❌ Обнаружены блюда с неправильным restaurantId:', {
          expectedRestaurantId: restaurantId,
          wrongDishes: wrongDishes.map(d => ({
            dishId: d.id,
            dishName: d.name,
            dishRestaurantId: d.restaurantId,
          })),
        });
        // Фильтруем неправильные блюда
        return dishes.filter(d => d.restaurantId === restaurantId);
      }
      
      return dishes;
    } catch (error: any) {
      console.error('❌ Ошибка fetchRestaurantMenu:', error);
      return rejectWithValue(error.message || 'Ошибка загрузки меню');
    }
  }
);

export const fetchDishById = createAsyncThunk(
  'dishes/fetchById',
  async (dishId: string, { rejectWithValue }) => {
    try {
      return await dishService.getDishById(dishId);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Ошибка загрузки блюда');
    }
  }
);

export const addDish = createAsyncThunk(
  'dishes/add',
  async (dishData: Partial<Dish>, { rejectWithValue }) => {
    try {
      return await dishService.createDish(dishData);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Ошибка добавления блюда');
    }
  }
);

const dishSlice = createSlice({
  name: 'dishes',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentDish: (state) => {
      state.currentDish = null;
    },
    clearMenu: (state) => {
      state.dishes = [];
      state.currentRestaurantId = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRestaurantMenu.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchRestaurantMenu.fulfilled, (state, action) => {
        state.isLoading = false;
        // Сохраняем меню только для текущего ресторана
        // В action.meta.arg хранится restaurantId который был передан (должен быть UUID)
        const restaurantId = action.meta.arg;
        if (restaurantId) {
          // ОЧИЩАЕМ старые блюда перед установкой новых
          state.dishes = [];
          state.currentRestaurantId = restaurantId;
          
          // Фильтруем блюда только для этого ресторана (на всякий случай)
          const payload = Array.isArray(action.payload) ? action.payload : [];
          const filteredDishes = payload.filter((dish: Dish) => {
            if (!dish || !dish.restaurantId) {
              console.warn('⚠️ Блюдо без restaurantId пропущено:', dish);
              return false;
            }
            const matches = dish.restaurantId === restaurantId;
            
            if (!matches) {
              console.error('❌ Блюдо с неправильным restaurantId:', {
                dishId: dish.id,
                dishName: dish.name,
                dishRestaurantId: dish.restaurantId,
                expectedRestaurantId: restaurantId,
                isGooglePlacesId: dish.restaurantId.startsWith('ChIJ'),
              });
            }
            
            return matches;
          });
          
          console.log('🍽️ Загружено меню в Redux:', {
            restaurantId,
            totalFromAPI: payload.length,
            filteredDishes: filteredDishes.length,
            dishesWithWrongRestaurant: payload.filter((d: Dish) => d?.restaurantId && d.restaurantId !== restaurantId).length,
            dishIds: filteredDishes.map((d: Dish) => ({ id: d.id, name: d.name, restaurantId: d.restaurantId })),
          });
          
          state.dishes = filteredDishes;
        } else {
          console.warn('⚠️ fetchRestaurantMenu: restaurantId не найден в action.meta.arg');
          state.dishes = [];
          state.currentRestaurantId = null;
        }
      })
      .addCase(fetchRestaurantMenu.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(fetchDishById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDishById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentDish = action.payload;
      })
      .addCase(fetchDishById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(addDish.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addDish.fulfilled, (state, action) => {
        state.isLoading = false;
        // НЕ добавляем блюдо автоматически в список - вместо этого перезагружаем меню
        // Это гарантирует что блюдо будет загружено с сервера с правильным restaurantId
        // И не будет добавлено если оно принадлежит другому ресторану
        const newDish = action.payload;
        console.log('✅ Блюдо добавлено в Redux:', {
          dishId: newDish.id,
          dishName: newDish.name,
          dishRestaurantId: newDish.restaurantId,
          currentRestaurantId: state.currentRestaurantId,
          match: state.currentRestaurantId && newDish.restaurantId === state.currentRestaurantId,
        });
        // НЕ добавляем в state.dishes - меню будет перезагружено в AddDishScreen
      })
      .addCase(addDish.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearCurrentDish, clearMenu } = dishSlice.actions;
export default dishSlice.reducer;


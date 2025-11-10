import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Dish } from '../../types';
import * as dishService from '../../services/dishService';

interface DishState {
  dishes: Dish[];
  currentDish: Dish | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: DishState = {
  dishes: [],
  currentDish: null,
  isLoading: false,
  error: null,
};

export const fetchRestaurantMenu = createAsyncThunk(
  'dishes/fetchMenu',
  async (restaurantId: string, { rejectWithValue }) => {
    try {
      return await dishService.getRestaurantMenu(restaurantId);
    } catch (error: any) {
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
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRestaurantMenu.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchRestaurantMenu.fulfilled, (state, action) => {
        state.isLoading = false;
        state.dishes = action.payload;
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
        state.dishes.push(action.payload);
      })
      .addCase(addDish.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearCurrentDish } = dishSlice.actions;
export default dishSlice.reducer;


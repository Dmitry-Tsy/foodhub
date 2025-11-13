import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FavoritesState {
  restaurantIds: string[];
  dishIds: string[];
}

const initialState: FavoritesState = {
  restaurantIds: [],
  dishIds: [],
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    toggleRestaurantFavorite: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      const index = state.restaurantIds.indexOf(id);
      
      if (index > -1) {
        state.restaurantIds.splice(index, 1);
        console.log('❌ Ресторан удален из избранного:', id);
      } else {
        state.restaurantIds.push(id);
        console.log('⭐ Ресторан добавлен в избранное:', id);
      }
    },
    
    toggleDishFavorite: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      const index = state.dishIds.indexOf(id);
      
      if (index > -1) {
        state.dishIds.splice(index, 1);
        console.log('❌ Блюдо удалено из избранного:', id);
      } else {
        state.dishIds.push(id);
        console.log('⭐ Блюдо добавлено в избранное:', id);
      }
    },
    
    clearFavorites: (state) => {
      state.restaurantIds = [];
      state.dishIds = [];
      console.log('🗑️ Избранное очищено');
    },
  },
});

export const { 
  toggleRestaurantFavorite, 
  toggleDishFavorite, 
  clearFavorites 
} = favoritesSlice.actions;

export default favoritesSlice.reducer;


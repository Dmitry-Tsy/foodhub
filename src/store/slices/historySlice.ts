import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Dish, Restaurant } from '../../types';

export type HistoryItem = {
  id: string;
  type: 'dish' | 'restaurant';
  item: Dish | Restaurant;
  viewedAt: string;
};

interface HistoryState {
  items: HistoryItem[];
  maxItems: number;
}

const initialState: HistoryState = {
  items: [],
  maxItems: 100, // Максимум 100 элементов в истории
};

const historySlice = createSlice({
  name: 'history',
  initialState,
  reducers: {
    addToHistory: (state, action: PayloadAction<{ type: 'dish' | 'restaurant'; item: Dish | Restaurant }>) => {
      const { type, item } = action.payload;
      
      // Удаляем существующую запись для этого элемента (если есть)
      state.items = state.items.filter((historyItem) => 
        !(historyItem.type === type && historyItem.id === item.id)
      );
      
      // Добавляем новую запись в начало
      state.items.unshift({
        id: item.id,
        type,
        item,
        viewedAt: new Date().toISOString(),
      });
      
      // Ограничиваем размер истории
      if (state.items.length > state.maxItems) {
        state.items = state.items.slice(0, state.maxItems);
      }
      
      console.log('📚 История обновлена:', {
        type,
        itemId: item.id,
        itemName: 'name' in item ? item.name : 'Restaurant',
        totalItems: state.items.length,
      });
    },
    
    clearHistory: (state) => {
      state.items = [];
      console.log('🗑️ История очищена');
    },
    
    removeFromHistory: (state, action: PayloadAction<{ type: 'dish' | 'restaurant'; id: string }>) => {
      const { type, id } = action.payload;
      state.items = state.items.filter((item) => !(item.type === type && item.id === id));
      console.log('🗑️ Удалено из истории:', { type, id });
    },
  },
});

export const { addToHistory, clearHistory, removeFromHistory } = historySlice.actions;
export default historySlice.reducer;


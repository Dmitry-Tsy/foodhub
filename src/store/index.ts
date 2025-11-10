import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import authReducer from './slices/authSlice';
import restaurantReducer from './slices/restaurantSlice';
import dishReducer from './slices/dishSlice';
import reviewReducer from './slices/reviewSlice';
import userReducer from './slices/userSlice';
import feedReducer from './slices/feedSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    restaurants: restaurantReducer,
    dishes: dishReducer,
    reviews: reviewReducer,
    users: userReducer,
    feed: feedReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Игнорируем некоторые пути для не-сериализуемых значений
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Типизированные хуки
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;


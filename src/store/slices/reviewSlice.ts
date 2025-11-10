import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { DishReview } from '../../types';
import * as reviewService from '../../services/reviewService';

interface ReviewState {
  reviews: DishReview[];
  isLoading: boolean;
  error: string | null;
  hasMore: boolean;
  page: number;
}

const initialState: ReviewState = {
  reviews: [],
  isLoading: false,
  error: null,
  hasMore: true,
  page: 1,
};

export const fetchDishReviews = createAsyncThunk(
  'reviews/fetchDishReviews',
  async ({ dishId, page = 1 }: { dishId: string; page?: number }, { rejectWithValue }) => {
    try {
      return await reviewService.getDishReviews(dishId, page);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Ошибка загрузки отзывов');
    }
  }
);

export const addReview = createAsyncThunk(
  'reviews/add',
  async (reviewData: Partial<DishReview>, { rejectWithValue }) => {
    try {
      return await reviewService.createReview(reviewData);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Ошибка добавления отзыва');
    }
  }
);

export const deleteReview = createAsyncThunk(
  'reviews/delete',
  async (reviewId: string, { rejectWithValue }) => {
    try {
      await reviewService.deleteReview(reviewId);
      return reviewId;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Ошибка удаления отзыва');
    }
  }
);

const reviewSlice = createSlice({
  name: 'reviews',
  initialState,
  reducers: {
    clearReviews: (state) => {
      state.reviews = [];
      state.page = 1;
      state.hasMore = true;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDishReviews.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDishReviews.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.meta.arg.page === 1) {
          state.reviews = action.payload.data;
        } else {
          state.reviews = [...state.reviews, ...action.payload.data];
        }
        state.hasMore = action.payload.hasMore;
        state.page = action.payload.page;
      })
      .addCase(fetchDishReviews.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(addReview.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addReview.fulfilled, (state, action) => {
        state.isLoading = false;
        state.reviews.unshift(action.payload);
      })
      .addCase(addReview.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(deleteReview.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.isLoading = false;
        state.reviews = state.reviews.filter(review => review.id !== action.payload);
      })
      .addCase(deleteReview.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearReviews, clearError } = reviewSlice.actions;
export default reviewSlice.reducer;


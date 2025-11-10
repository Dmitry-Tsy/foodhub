import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { FeedItem } from '../../types';
import * as feedService from '../../services/feedService';

interface FeedState {
  items: FeedItem[];
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  hasMore: boolean;
  page: number;
}

const initialState: FeedState = {
  items: [],
  isLoading: false,
  isRefreshing: false,
  error: null,
  hasMore: true,
  page: 1,
};

export const fetchFeed = createAsyncThunk(
  'feed/fetch',
  async ({ page = 1, refresh = false }: { page?: number; refresh?: boolean }, { rejectWithValue }) => {
    try {
      return await feedService.getFeed(page);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Ошибка загрузки ленты');
    }
  }
);

export const refreshFeed = createAsyncThunk(
  'feed/refresh',
  async (_, { rejectWithValue }) => {
    try {
      return await feedService.getFeed(1);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Ошибка обновления ленты');
    }
  }
);

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    clearFeed: (state) => {
      state.items = [];
      state.page = 1;
      state.hasMore = true;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeed.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFeed.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.meta.arg.page === 1) {
          state.items = action.payload.data;
        } else {
          state.items = [...state.items, ...action.payload.data];
        }
        state.hasMore = action.payload.hasMore;
        state.page = action.payload.page;
      })
      .addCase(fetchFeed.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(refreshFeed.pending, (state) => {
        state.isRefreshing = true;
        state.error = null;
      })
      .addCase(refreshFeed.fulfilled, (state, action) => {
        state.isRefreshing = false;
        state.items = action.payload.data;
        state.hasMore = action.payload.hasMore;
        state.page = 1;
      })
      .addCase(refreshFeed.rejected, (state, action) => {
        state.isRefreshing = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearFeed, clearError } = feedSlice.actions;
export default feedSlice.reducer;


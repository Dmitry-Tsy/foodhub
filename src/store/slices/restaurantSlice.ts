import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Restaurant, Location } from '../../types';
import * as restaurantService from '../../services/restaurantService';

interface RestaurantState {
  restaurants: Restaurant[];
  currentRestaurant: Restaurant | null;
  isLoading: boolean;
  error: string | null;
  userLocation: Location | null;
  searchQuery: string;
  filters: {
    cuisineType?: string;
    maxDistance?: number;
  };
}

const initialState: RestaurantState = {
  restaurants: [],
  currentRestaurant: null,
  isLoading: false,
  error: null,
  userLocation: null,
  searchQuery: '',
  filters: {},
};

export const fetchNearbyRestaurants = createAsyncThunk(
  'restaurants/fetchNearby',
  async ({ location, radius }: { location: Location; radius?: number }, { rejectWithValue }) => {
    try {
      return await restaurantService.getNearbyRestaurants(location, radius);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Ошибка загрузки ресторанов');
    }
  }
);

export const fetchRestaurantById = createAsyncThunk(
  'restaurants/fetchById',
  async (restaurantId: string, { rejectWithValue }) => {
    try {
      return await restaurantService.getRestaurantById(restaurantId);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Ошибка загрузки ресторана');
    }
  }
);

export const searchRestaurants = createAsyncThunk(
  'restaurants/search',
  async (query: string, { rejectWithValue }) => {
    try {
      return await restaurantService.searchRestaurants(query);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Ошибка поиска');
    }
  }
);

const restaurantSlice = createSlice({
  name: 'restaurants',
  initialState,
  reducers: {
    setUserLocation: (state, action: PayloadAction<Location>) => {
      state.userLocation = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setFilters: (state, action: PayloadAction<RestaurantState['filters']>) => {
      state.filters = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNearbyRestaurants.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchNearbyRestaurants.fulfilled, (state, action) => {
        state.isLoading = false;
        state.restaurants = action.payload;
      })
      .addCase(fetchNearbyRestaurants.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(fetchRestaurantById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchRestaurantById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentRestaurant = action.payload;
      })
      .addCase(fetchRestaurantById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(searchRestaurants.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(searchRestaurants.fulfilled, (state, action) => {
        state.isLoading = false;
        state.restaurants = action.payload;
      })
      .addCase(searchRestaurants.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setUserLocation, setSearchQuery, setFilters, clearError } = restaurantSlice.actions;
export default restaurantSlice.reducer;


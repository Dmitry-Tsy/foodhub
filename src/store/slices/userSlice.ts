import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { User } from '../../types';
import * as userService from '../../services/userService';

interface UserState {
  currentProfile: User | null;
  following: User[];
  followers: User[];
  isLoading: boolean;
  error: string | null;
}

const initialState: UserState = {
  currentProfile: null,
  following: [],
  followers: [],
  isLoading: false,
  error: null,
};

export const fetchUserProfile = createAsyncThunk(
  'users/fetchProfile',
  async (userId: string, { rejectWithValue }) => {
    try {
      return await userService.getUserProfile(userId);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Ошибка загрузки профиля');
    }
  }
);

export const followUser = createAsyncThunk(
  'users/follow',
  async (userId: string, { rejectWithValue }) => {
    try {
      return await userService.followUser(userId);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Ошибка подписки');
    }
  }
);

export const unfollowUser = createAsyncThunk(
  'users/unfollow',
  async (userId: string, { rejectWithValue }) => {
    try {
      return await userService.unfollowUser(userId);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Ошибка отписки');
    }
  }
);

export const rateTrust = createAsyncThunk(
  'users/rateTrust',
  async ({ userId, rating }: { userId: string; rating: number }, { rejectWithValue }) => {
    try {
      return await userService.rateTrust(userId, rating);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Ошибка оценки доверия');
    }
  }
);

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentProfile: (state) => {
      state.currentProfile = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentProfile = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(followUser.fulfilled, (state, action) => {
        if (state.currentProfile) {
          state.currentProfile.followersCount += 1;
        }
      });

    builder
      .addCase(unfollowUser.fulfilled, (state, action) => {
        if (state.currentProfile) {
          state.currentProfile.followersCount -= 1;
        }
      });

    builder
      .addCase(rateTrust.fulfilled, (state, action) => {
        if (state.currentProfile) {
          state.currentProfile.trustScore = action.payload.newTrustScore;
        }
      });
  },
});

export const { clearError, clearCurrentProfile } = userSlice.actions;
export default userSlice.reducer;


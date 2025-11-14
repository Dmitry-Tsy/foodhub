import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, User, LoginCredentials, RegisterData } from '../../types';
import * as authService from '../../services/authService';
import * as secureStorage from '../../services/secureStorage';

const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: true, // Показываем loading пока проверяем сохраненный токен
  isAuthenticated: false,
  isGuest: false,
  error: null,
};

// Async thunks
export const login = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials);
      if (response.token) {
        await secureStorage.saveToken(response.token);
      }
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Ошибка входа');
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (data: RegisterData, { rejectWithValue }) => {
    try {
      const response = await authService.register(data);
      if (response.token) {
        await secureStorage.saveToken(response.token);
      }
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Ошибка регистрации');
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async () => {
    await secureStorage.deleteToken();
  }
);

export const loadUser = createAsyncThunk(
  'auth/loadUser',
  async (_, { rejectWithValue }) => {
    try {
      const token = await secureStorage.getToken();
      if (!token) {
        // Токена нет - это нормально, пользователь просто не входил
        return rejectWithValue({ type: 'NO_TOKEN' });
      }
      const user = await authService.getCurrentUser(token);
      return { user, token };
    } catch (error: any) {
      // Ошибка при загрузке - токен может быть невалидным
      await secureStorage.deleteToken();
      return rejectWithValue({ 
        type: 'ERROR', 
        message: error.message || 'Ошибка загрузки пользователя' 
      });
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    continueAsGuest: (state) => {
      state.isGuest = true;
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
    },
    exitGuestMode: (state) => {
      state.isGuest = false;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.isGuest = false; // Убираем режим гостя при логине
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.error = action.payload as string;
      });

    // Register
    builder
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.isGuest = false; // Убираем режим гостя при регистрации
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.error = action.payload as string;
      });

    // Logout
    builder.addCase(logout.fulfilled, (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isGuest = false;
      state.error = null;
    });

    // Load User
    builder
      .addCase(loadUser.pending, (state) => {
        // Не меняем isLoading - он уже true из initialState
      })
      .addCase(loadUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(loadUser.rejected, (state, action: any) => {
        state.isLoading = false;
        // Если просто нет токена - это нормально
        // Если ошибка - показываем её
        if (action.payload?.type === 'ERROR') {
          state.error = action.payload.message;
        }
        // В любом случае пользователь не аутентифицирован
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
      });
  },
});

export const { clearError, updateUser, continueAsGuest, exitGuestMode } = authSlice.actions;
export default authSlice.reducer;


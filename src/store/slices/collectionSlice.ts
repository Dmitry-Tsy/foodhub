import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  Collection,
  CollectionCreationAttributes,
} from '../../types';
import * as collectionService from '../../services/collectionService';

interface CollectionState {
  collections: Collection[];
  currentCollection: Collection | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: CollectionState = {
  collections: [],
  currentCollection: null,
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchUserCollections = createAsyncThunk(
  'collections/fetchUserCollections',
  async (publicOnly?: boolean) => {
    const response = await collectionService.getUserCollections(publicOnly);
    if (!response.success || !response.collections) {
      throw new Error(response.error || 'Не удалось загрузить коллекции');
    }
    return response.collections;
  }
);

export const fetchPublicCollections = createAsyncThunk(
  'collections/fetchPublicCollections',
  async ({ limit, offset, userId }: { limit?: number; offset?: number; userId?: string }) => {
    const response = await collectionService.getPublicCollections(limit, offset, userId);
    if (!response.success || !response.collections) {
      throw new Error(response.error || 'Не удалось загрузить публичные коллекции');
    }
    return { collections: response.collections, hasMore: response.hasMore || false };
  }
);

export const fetchCollectionById = createAsyncThunk(
  'collections/fetchCollectionById',
  async (collectionId: string) => {
    const response = await collectionService.getCollectionById(collectionId);
    if (!response.success || !response.collection) {
      throw new Error(response.error || 'Не удалось загрузить коллекцию');
    }
    return response.collection;
  }
);

export const createCollection = createAsyncThunk(
  'collections/createCollection',
  async (data: CollectionCreationAttributes) => {
    const response = await collectionService.createCollection(data);
    if (!response.success || !response.collection) {
      throw new Error(response.error || 'Не удалось создать коллекцию');
    }
    return response.collection;
  }
);

export const updateCollection = createAsyncThunk(
  'collections/updateCollection',
  async ({ collectionId, data }: { collectionId: string; data: Partial<CollectionCreationAttributes> }) => {
    const response = await collectionService.updateCollection(collectionId, data);
    if (!response.success || !response.collection) {
      throw new Error(response.error || 'Не удалось обновить коллекцию');
    }
    return response.collection;
  }
);

export const deleteCollection = createAsyncThunk(
  'collections/deleteCollection',
  async (collectionId: string) => {
    const response = await collectionService.deleteCollection(collectionId);
    if (!response.success) {
      throw new Error(response.error || 'Не удалось удалить коллекцию');
    }
    return collectionId;
  }
);

export const addDishToCollection = createAsyncThunk(
  'collections/addDishToCollection',
  async ({ collectionId, dishId }: { collectionId: string; dishId: string }) => {
    const response = await collectionService.addDishToCollection(collectionId, dishId);
    if (!response.success) {
      throw new Error(response.error || 'Не удалось добавить блюдо в коллекцию');
    }
    return { collectionId, dishId };
  }
);

export const removeDishFromCollection = createAsyncThunk(
  'collections/removeDishFromCollection',
  async ({ collectionId, dishId }: { collectionId: string; dishId: string }) => {
    const response = await collectionService.removeDishFromCollection(collectionId, dishId);
    if (!response.success) {
      throw new Error(response.error || 'Не удалось удалить блюдо из коллекции');
    }
    return { collectionId, dishId };
  }
);

const collectionSlice = createSlice({
  name: 'collections',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentCollection: (state) => {
      state.currentCollection = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchUserCollections
      .addCase(fetchUserCollections.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserCollections.fulfilled, (state, action) => {
        state.isLoading = false;
        state.collections = action.payload;
      })
      .addCase(fetchUserCollections.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка загрузки коллекций';
      })
      // fetchPublicCollections
      .addCase(fetchPublicCollections.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPublicCollections.fulfilled, (state, action) => {
        state.isLoading = false;
        state.collections = action.payload.collections;
      })
      .addCase(fetchPublicCollections.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка загрузки публичных коллекций';
      })
      // fetchCollectionById
      .addCase(fetchCollectionById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCollectionById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentCollection = action.payload;
      })
      .addCase(fetchCollectionById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка загрузки коллекции';
      })
      // createCollection
      .addCase(createCollection.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createCollection.fulfilled, (state, action) => {
        state.isLoading = false;
        state.collections.unshift(action.payload);
        state.currentCollection = action.payload;
      })
      .addCase(createCollection.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка создания коллекции';
      })
      // updateCollection
      .addCase(updateCollection.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateCollection.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.collections.findIndex((c) => c.id === action.payload.id);
        if (index > -1) {
          state.collections[index] = action.payload;
        }
        if (state.currentCollection?.id === action.payload.id) {
          state.currentCollection = action.payload;
        }
      })
      .addCase(updateCollection.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка обновления коллекции';
      })
      // deleteCollection
      .addCase(deleteCollection.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteCollection.fulfilled, (state, action) => {
        state.isLoading = false;
        state.collections = state.collections.filter((c) => c.id !== action.payload);
        if (state.currentCollection?.id === action.payload) {
          state.currentCollection = null;
        }
      })
      .addCase(deleteCollection.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка удаления коллекции';
      })
      // addDishToCollection
      .addCase(addDishToCollection.fulfilled, (state, action) => {
        if (state.currentCollection?.id === action.payload.collectionId) {
          // Обновляем счетчик блюд
          if (state.currentCollection.dishCount !== undefined) {
            state.currentCollection.dishCount += 1;
          }
        }
      })
      // removeDishFromCollection
      .addCase(removeDishFromCollection.fulfilled, (state, action) => {
        if (state.currentCollection?.id === action.payload.collectionId) {
          // Обновляем счетчик блюд
          if (state.currentCollection.dishCount !== undefined) {
            state.currentCollection.dishCount = Math.max(0, state.currentCollection.dishCount - 1);
          }
        }
      });
  },
});

export const { clearError, clearCurrentCollection } = collectionSlice.actions;
export default collectionSlice.reducer;


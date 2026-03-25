import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { ShoppingListState, ShoppingItem, FilterType, SortType, ShoppingItemUpdate } from '../../types';
import { shoppingListAPI } from '../../services/api';

export const fetchShoppingList = createAsyncThunk(
  'shoppingList/fetchList',
  async (userId: string, { rejectWithValue }) => {
    try {
      const items = await shoppingListAPI.getList(userId);
      return items;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch shopping list');
    }
  }
);

export const saveShoppingList = createAsyncThunk(
  'shoppingList/saveList',
  async ({ userId, items }: { userId: string; items: ShoppingItem[] }, { rejectWithValue }) => {
    try {
      await shoppingListAPI.updateList(userId, items);
      return items;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to save shopping list');
    }
  }
);

export const generateShareToken = createAsyncThunk(
  'shoppingList/generateShareToken',
  async ({ userId, items }: { userId: string; items: ShoppingItem[] }, { rejectWithValue }) => {
    try {
      const shareToken = await shoppingListAPI.generateShareToken(userId, items);
      return shareToken;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to generate share token');
    }
  }
);

export const fetchSharedList = createAsyncThunk(
  'shoppingList/fetchSharedList',
  async (shareToken: string, { rejectWithValue }) => {
    try {
      const sharedList = await shoppingListAPI.getSharedList(shareToken);
      return sharedList;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch shared list');
    }
  }
);

const initialState: ShoppingListState = {
  items: [],
  filter: 'all',
  sortBy: 'date-desc',
  searchQuery: '',
  editingId: null,
  isLoading: false,
  error: null,
  shareToken: undefined,
  sharedData: null,
};

const shoppingListSlice = createSlice({
  name: 'shoppingList',
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<{ id: string; text: string; quantity?: number; notes?: string; category?: string; images?: string[] }>) => {
      const newItem: ShoppingItem = {
        id: action.payload.id,
        text: action.payload.text,
        completed: false,
        quantity: action.payload.quantity || 1,
        notes: action.payload.notes,
        category: action.payload.category,
        images: action.payload.images,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      state.items.push(newItem);
    },

    toggleItem: (state, action: PayloadAction<string>) => {
      const item = state.items.find(item => item.id === action.payload);
      if (item) {
        item.completed = !item.completed;
        item.updatedAt = Date.now();
      }
    },

    deleteItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },

    updateItem: (state, action: PayloadAction<{ id: string; updates: ShoppingItemUpdate }>) => {
      const item = state.items.find(item => item.id === action.payload.id);
      if (item) {
        Object.assign(item, action.payload.updates);
        item.updatedAt = Date.now();
      }
    },

    startEditing: (state, action: PayloadAction<string>) => {
      state.editingId = action.payload;
    },

    cancelEditing: (state) => {
      state.editingId = null;
    },

    saveEdit: (state, action: PayloadAction<{ id: string; text: string }>) => {
      const item = state.items.find(item => item.id === action.payload.id);
      if (item) {
        item.text = action.payload.text;
        item.updatedAt = Date.now();
      }
      state.editingId = null;
    },

    setFilter: (state, action: PayloadAction<FilterType>) => {
      state.filter = action.payload;
    },

    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },

    setSortBy: (state, action: PayloadAction<SortType>) => {
      state.sortBy = action.payload;
    },

    clearCompleted: (state) => {
      state.items = state.items.filter(item => !item.completed);
    },

    toggleAll: (state) => {
      const hasIncomplete = state.items.some(item => !item.completed);
      state.items.forEach(item => {
        item.completed = hasIncomplete;
        item.updatedAt = Date.now();
      });
    },

    clearError: (state) => {
      state.error = null;
    },

    clearShareToken: (state) => {
      state.shareToken = undefined;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchShoppingList.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchShoppingList.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
        state.error = null;
      })
      .addCase(fetchShoppingList.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(saveShoppingList.pending, (_state) => {})
      .addCase(saveShoppingList.fulfilled, (state, _action) => {
        state.error = null;
      })
      .addCase(saveShoppingList.rejected, (state, action) => {
        state.error = action.payload as string;
      });

    builder
      .addCase(generateShareToken.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(generateShareToken.fulfilled, (state, action) => {
        state.isLoading = false;
        state.shareToken = action.payload;
        state.error = null;
      })
      .addCase(generateShareToken.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(fetchSharedList.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.sharedData = null;
      })
      .addCase(fetchSharedList.fulfilled, (state, action) => {
        state.isLoading = false;
        state.sharedData = action.payload;
        state.error = null;
      })
      .addCase(fetchSharedList.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.sharedData = null;
      });
  },
});

export const {
  addItem,
  toggleItem,
  deleteItem,
  updateItem,
  startEditing,
  cancelEditing,
  saveEdit,
  setFilter,
  setSearchQuery,
  setSortBy,
  clearCompleted,
  toggleAll,
  clearError,
  clearShareToken,
} = shoppingListSlice.actions;

export default shoppingListSlice.reducer;
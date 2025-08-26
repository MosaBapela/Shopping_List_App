// Shopping List Redux Slice with API integration - Enhanced with search, sort, and update
import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { ShoppingListState, ShoppingItem, FilterType, SortType, ShoppingItemUpdate, ShareableList } from '../../types';
import { shoppingListAPI } from '../../services/api';

// Async thunks for API calls
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

// New async thunk for generating share token
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

// New async thunk for fetching shared list
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

// Initial state - starts with an empty shopping list
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

// Create the shopping list slice with all our actions and reducers
const shoppingListSlice = createSlice({
  name: 'shoppingList',
  initialState,
  reducers: {
    // Local state actions (will trigger save)
    // Add a new item to the shopping list
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

    // Toggle the completed status of an item
    toggleItem: (state, action: PayloadAction<string>) => {
      const item = state.items.find(item => item.id === action.payload);
      if (item) {
        item.completed = !item.completed;
        item.updatedAt = Date.now();
      }
    },

    // Delete an item from the list
    deleteItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },

    // NEW: Update an existing item
    updateItem: (state, action: PayloadAction<{ id: string; updates: ShoppingItemUpdate }>) => {
      const item = state.items.find(item => item.id === action.payload.id);
      if (item) {
        Object.assign(item, action.payload.updates);
        item.updatedAt = Date.now();
      }
    },

    // Start editing an item (sets the editing state)
    startEditing: (state, action: PayloadAction<string>) => {
      state.editingId = action.payload;
    },

    // Cancel editing (clears the editing state)
    cancelEditing: (state) => {
      state.editingId = null;
    },

    // Save the edited item with new text
    saveEdit: (state, action: PayloadAction<{ id: string; text: string }>) => {
      const item = state.items.find(item => item.id === action.payload.id);
      if (item) {
        item.text = action.payload.text;
        item.updatedAt = Date.now();
      }
      state.editingId = null;
    },

    // Set the current filter (all, active, or completed)
    setFilter: (state, action: PayloadAction<FilterType>) => {
      state.filter = action.payload;
    },

    // NEW: Set search query
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },

    // NEW: Set sort type
    setSortBy: (state, action: PayloadAction<SortType>) => {
      state.sortBy = action.payload;
    },

    // Clear all completed items from the list
    clearCompleted: (state) => {
      state.items = state.items.filter(item => !item.completed);
    },

    // Toggle all items between completed/uncompleted
    toggleAll: (state) => {
      const hasIncomplete = state.items.some(item => !item.completed);
      state.items.forEach(item => {
        item.completed = hasIncomplete;
        item.updatedAt = Date.now();
      });
    },

    // Clear error
    clearError: (state) => {
      state.error = null;
    },

    // Clear share token
    clearShareToken: (state) => {
      state.shareToken = undefined;
    },
  },
  extraReducers: (builder) => {
    // Fetch shopping list
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

    // Save shopping list
    builder
      .addCase(saveShoppingList.pending, (state) => {
        // Don't show loading for saves to keep UI responsive
      })
      .addCase(saveShoppingList.fulfilled, (state, action) => {
        // Items already updated by local actions
        state.error = null;
      })
      .addCase(saveShoppingList.rejected, (state, action) => {
        state.error = action.payload as string;
      });

    // Generate share token
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

    // Fetch shared list
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

// Export the action creators
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

// Export the reducer
export default shoppingListSlice.reducer;
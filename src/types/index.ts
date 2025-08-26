// Type definitions for the application

export interface User {
  id: string;
  email: string;
  name: string;
  surname: string; // Added surname
  cellNumber: string; // Added cell number
  avatar?: string;
  createdAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  name: string;
  surname: string; // Added surname
  cellNumber: string; // Added cell number
}

export interface UserUpdateData {
name?: string;
surname?: string;
email?: string;
cellNumber?: string;
password?: string; // For password updates
}

export interface ShoppingItem {
  id: string;
  text: string;
  completed: boolean;
  quantity: number;
  notes?: string;
  category?: string;
  images?: string[];
  createdAt: number;
  updatedAt: number;
}

// New interface for updating shopping items
export interface ShoppingItemUpdate {
  text?: string;
  quantity?: number;
  notes?: string;
  category?: string;
  images?: string[];
}

export interface ShoppingList {
  id: string;
  userId: string;
  items: ShoppingItem[];
  isShared?: boolean;
  shareToken?: string;
}

export type FilterType = 'all' | 'active' | 'completed';
export type SortType = 'name-asc' | 'name-desc' | 'category-asc' | 'category-desc' | 'date-asc' | 'date-desc';

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface ShoppingListState {
  items: ShoppingItem[];
  filter: FilterType;
  sortBy: SortType;
  searchQuery: string;
  editingId: string | null;
  isLoading: boolean;
  error: string | null;
  shareToken?: string;
  sharedData?: ShareableList | null;
}

// For sharing functionality
export interface ShareableList {
  items: ShoppingItem[];
  ownerName: string;
  createdAt: string;
}
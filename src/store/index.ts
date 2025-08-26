import { configureStore } from '@reduxjs/toolkit';
import shoppingListSlice from './slices/shoppingListSlice';
import authSlice from './slices/authSlice';
import formSlice from './slices/formSlice';

// Configure the Redux store with our shopping list slice
export const store = configureStore({
  reducer: {
    shoppingList: shoppingListSlice,
    auth: authSlice,
    form: formSlice,
  },
  // Enable Redux DevTools for development debugging
  devTools: import.meta.env.MODE !== 'production',
});

// Export types for TypeScript integration
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
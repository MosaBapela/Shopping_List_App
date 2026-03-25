import { configureStore } from '@reduxjs/toolkit';
import shoppingListSlice from './slices/shoppingListSlice';
import authSlice from './slices/authSlice';
import formSlice from './slices/formSlice';

export const store = configureStore({
  reducer: {
    shoppingList: shoppingListSlice,
    auth: authSlice,
    form: formSlice,
  },
  devTools: import.meta.env.MODE !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
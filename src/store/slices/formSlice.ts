// Form Redux Slice for managing form states across components
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface FormState {
  addItemForm: {
    text: string;
    quantity: number;
    notes: string;
    category: string;
    images: string[];
    isSubmitting: boolean;
    errors: Record<string, string>;
  };
  loginForm: {
    email: string;
    password: string;
    showPassword: boolean;
  };
  registerForm: {
    name: string;
    surname: string;
    email: string;
    cellNumber: string;
    password: string;
    confirmPassword: string;
    showPassword: boolean;
    showConfirmPassword: boolean;
  };
  profileForm: {
    name: string;
    surname: string;
    email: string;
    cellNumber: string;
    isEditing: boolean;
  };
  shoppingListItemEdit: {
    [itemId: string]: {
      text: string;
      quantity: number;
      notes: string;
      category: string;
      images: string[];
      newImageUrl: string;
    };
  };
}

const initialState: FormState = {
  addItemForm: {
    text: '',
    quantity: 1,
    notes: '',
    category: '',
    images: [],
    isSubmitting: false,
    errors: {},
  },
  loginForm: {
    email: '',
    password: '',
    showPassword: false,
  },
  registerForm: {
    name: '',
    surname: '',
    email: '',
    cellNumber: '',
    password: '',
    confirmPassword: '',
    showPassword: false,
    showConfirmPassword: false,
  },
  profileForm: {
    name: '',
    surname: '',
    email: '',
    cellNumber: '',
    isEditing: false,
  },
  shoppingListItemEdit: {},
};

const formSlice = createSlice({
  name: 'form',
  initialState,
  reducers: {
    // Add Item Form Actions
    setAddItemFormField: (state, action: PayloadAction<{ field: string; value: any }>) => {
      const { field, value } = action.payload;
      if (field in state.addItemForm) {
        (state.addItemForm as any)[field] = value;
      }
    },
    setAddItemFormErrors: (state, action: PayloadAction<Record<string, string>>) => {
      state.addItemForm.errors = action.payload;
    },
    clearAddItemForm: (state) => {
      state.addItemForm = initialState.addItemForm;
    },
    setAddItemFormSubmitting: (state, action: PayloadAction<boolean>) => {
      state.addItemForm.isSubmitting = action.payload;
    },

    // Login Form Actions
    setLoginFormField: (state, action: PayloadAction<{ field: string; value: any }>) => {
      const { field, value } = action.payload;
      if (field in state.loginForm) {
        (state.loginForm as any)[field] = value;
      }
    },
    clearLoginForm: (state) => {
      state.loginForm = initialState.loginForm;
    },

    // Register Form Actions
    setRegisterFormField: (state, action: PayloadAction<{ field: string; value: any }>) => {
      const { field, value } = action.payload;
      if (field in state.registerForm) {
        (state.registerForm as any)[field] = value;
      }
    },
    clearRegisterForm: (state) => {
      state.registerForm = initialState.registerForm;
    },

    // Profile Form Actions
    setProfileFormField: (state, action: PayloadAction<{ field: string; value: any }>) => {
      const { field, value } = action.payload;
      if (field in state.profileForm) {
        (state.profileForm as any)[field] = value;
      }
    },
    setProfileFormEditing: (state, action: PayloadAction<boolean>) => {
      state.profileForm.isEditing = action.payload;
    },
    resetProfileForm: (state) => {
      const { user } = state as any; // This will be populated from auth state
      if (user) {
        state.profileForm.name = user.name || '';
        state.profileForm.surname = user.surname || '';
        state.profileForm.email = user.email || '';
        state.profileForm.cellNumber = user.cellNumber || '';
      }
    },

    // Shopping List Item Edit Actions
    setItemEditData: (state, action: PayloadAction<{ itemId: string; data: Partial<FormState['shoppingListItemEdit'][string]> }>) => {
      const { itemId, data } = action.payload;
      if (!state.shoppingListItemEdit[itemId]) {
        state.shoppingListItemEdit[itemId] = {
          text: '',
          quantity: 1,
          notes: '',
          category: '',
          images: [],
          newImageUrl: '',
        };
      }
      Object.assign(state.shoppingListItemEdit[itemId], data);
    },
    clearItemEditData: (state, action: PayloadAction<string>) => {
      delete state.shoppingListItemEdit[action.payload];
    },
  },
});

export const {
  setAddItemFormField,
  setAddItemFormErrors,
  clearAddItemForm,
  setAddItemFormSubmitting,
  setLoginFormField,
  clearLoginForm,
  setRegisterFormField,
  clearRegisterForm,
  setProfileFormField,
  setProfileFormEditing,
  resetProfileForm,
  setItemEditData,
  clearItemEditData,
} = formSlice.actions;

export default formSlice.reducer;

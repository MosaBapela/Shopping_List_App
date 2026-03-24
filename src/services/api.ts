// API service for communicating with JSON server - Enhanced with sharing functionality
import axios from 'axios';
import type { User, LoginCredentials, RegisterCredentials, ShoppingItem, UserUpdateData, ShareableList } from '../types';

const API_BASE_URL = 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Simple encryption/decryption functions
const encryptPassword = (password: string): string => {
  // In a real application, use a proper encryption library like bcrypt
  return btoa(password);
};

const decryptPassword = (encryptedPassword: string): string => {
  
  // In a real application, use proper decryption
  return atob(encryptedPassword);
};

// Demo account data
const DEMO_USER = {
  id: 'demo-user-123',
  email: 'demo@example.com',
  password: encryptPassword('password123'),
  name: 'Demo',
  surname: 'User',
  cellNumber: '+1234567890',
  avatar: 'https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
  createdAt: new Date().toISOString(),
};

// Demo shopping list items
const DEMO_ITEMS: ShoppingItem[] = [
  {
    id: 'demo-item-1',
    text: 'Organic Bananas',
    completed: false,
    quantity: 6,
    notes: 'Get ripe ones for smoothies',
    category: 'grocery',
    images: ['https://images.pexels.com/photos/61127/pexels-photo-61127.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop'],
    createdAt: Date.now() - 86400000,
    updatedAt: Date.now() - 86400000,
  },
  {
    id: 'demo-item-2',
    text: 'Whole Grain Bread',
    completed: true,
    quantity: 1,
    notes: 'Seeded variety preferred',
    category: 'grocery',
    images: [],
    createdAt: Date.now() - 172800000,
    updatedAt: Date.now() - 3600000,
  },
  {
    id: 'demo-item-3',
    text: 'Wireless Headphones',
    completed: false,
    quantity: 1,
    notes: 'Noise-cancelling, budget under $100',
    category: 'electronics',
    images: ['https://images.pexels.com/photos/3587478/pexels-photo-3587478.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop'],
    createdAt: Date.now() - 259200000,
    updatedAt: Date.now() - 259200000,
  },
  {
    id: 'demo-item-4',
    text: 'Laundry Detergent',
    completed: false,
    quantity: 2,
    notes: 'Eco-friendly brand',
    category: 'household',
    images: [],
    createdAt: Date.now() - 345600000,
    updatedAt: Date.now() - 345600000,
  },
];

// Helper function to ensure demo account exists
const ensureDemoAccountExists = async () => {
  try {
    const response = await api.get(`/users?id=${DEMO_USER.id}`);
    if (response.data.length === 0) {
      // Create demo user
      await api.post('/users', DEMO_USER);
      
      // Create demo shopping list
      await api.post('/shoppingLists', {
        id: `list-${DEMO_USER.id}`,
        userId: DEMO_USER.id,
        items: DEMO_ITEMS,
      });
    }
  } catch (error) {
    console.warn('Could not ensure demo account exists:', error);
  }
};

// Auth API
export const authAPI = {
  login: async (credentials: LoginCredentials): Promise<User> => {
    // Ensure demo account exists
    await ensureDemoAccountExists();
    
    // Get all users to find matching email
    const response = await api.get(`/users?email=${credentials.email}`);
    const users = response.data;
    
    if (users.length === 0) {
      throw new Error('Invalid email or password');
    }
    
    const user = users[0];
    
    // Decrypt stored password for comparison
    const decryptedPassword = decryptPassword(user.password);
    
    if (decryptedPassword !== credentials.password) {
      throw new Error('Invalid email or password');
    }
    
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },

  register: async (credentials: RegisterCredentials): Promise<User> => {
    // Check if user already exists
    const existingUsers = await api.get(`/users?email=${credentials.email}`);
    if (existingUsers.data.length > 0) {
      throw new Error('User with this email already exists');
    }

    // Encrypt password before storing
    const encryptedPassword = encryptPassword(credentials.password);

    // Create new user
    const newUser = {
      id: Date.now().toString(),
      email: credentials.email,
      password: encryptedPassword,
      name: credentials.name,
      surname: credentials.surname,
      cellNumber: credentials.cellNumber,
      avatar: `https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop`,
      createdAt: new Date().toISOString(),
    };

    const response = await api.post('/users', newUser);
    
    // Create empty shopping list for new user
    await api.post('/shoppingLists', {
      id: Date.now().toString(),
      userId: newUser.id,
      items: [],
    });

    const { password, ...user } = response.data;
    return user;
  },

  updateProfile: async (userId: string, updates: UserUpdateData): Promise<User> => {
    // If password is being updated, encrypt it
    let updatedData = { ...updates };
    if (updates.password) {
      updatedData = {
        ...updates,
        password: encryptPassword(updates.password)
      };
    }
    
    const response = await api.patch(`/users/${userId}`, updatedData);
    const { password, ...user } = response.data;
    return user;
  },
};

// Shopping List API
export const shoppingListAPI = {
  getList: async (userId: string): Promise<ShoppingItem[]> => {
    const response = await api.get(`/shoppingLists?userId=${userId}`);
    const lists = response.data;
    
    if (lists.length === 0) {
      // Create empty list if none exists
      await api.post('/shoppingLists', {
        id: Date.now().toString(),
        userId,
        items: [],
      });
      return [];
    }
    
    return lists[0].items || [];
  },

  updateList: async (userId: string, items: ShoppingItem[]): Promise<void> => {
    const response = await api.get(`/shoppingLists?userId=${userId}`);
    const lists = response.data;
    
    if (lists.length > 0) {
      await api.patch(`/shoppingLists/${lists[0].id}`, { items });
    } else {
      await api.post('/shoppingLists', {
        id: Date.now().toString(),
        userId,
        items,
      });
    }
  },

  // NEW: Generate share token for sharing lists
  generateShareToken: async (userId: string, items: ShoppingItem[]): Promise<string> => {
    const shareToken = `share_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Get user info for the shareable list
    const userResponse = await api.get(`/users/${userId}`);
    const user = userResponse.data;
    
    // Create shareable list
    const shareableList: ShareableList = {
      items,
      ownerName: `${user.name} ${user.surname}`,
      createdAt: new Date().toISOString(),
    };
    
    // Store the shareable list with the token
    await api.post('/sharedLists', {
      id: shareToken,
      shareToken,
      ...shareableList,
    });
    
    return shareToken;
  },

  // NEW: Get shared list by token
  getSharedList: async (shareToken: string): Promise<ShareableList> => {
    const response = await api.get(`/sharedLists/${shareToken}`);
    return response.data;
  },
};

export default api;
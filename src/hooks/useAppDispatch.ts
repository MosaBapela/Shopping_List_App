// Custom hook for typed Redux dispatch
// This provides type safety when dispatching actions

import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../store';

// Create a typed version of useDispatch hook
export const useAppDispatch = () => useDispatch<AppDispatch>();
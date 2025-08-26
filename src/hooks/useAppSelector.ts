// Custom hook for typed Redux selector
// This provides type safety when selecting data from the Redux store

import { useSelector, type TypedUseSelectorHook,  } from 'react-redux';
import type { RootState } from '../store';

// Create a typed version of useSelector hook
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
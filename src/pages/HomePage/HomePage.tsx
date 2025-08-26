// Home Page Component - Main shopping list interface with enhanced features
import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { 
  fetchShoppingList, 
  saveShoppingList, 
  setSearchQuery, 
  setSortBy,
  setFilter
} from '../../store/slices/shoppingListSlice';
import type { SortType, FilterType } from '../../types';
import './HomePage.css';
import Navigation from '../../componets/Navigation/Navigation';
import ShoppingListHeader from '../../componets/ShoppingListHeader/ShoppingListHeader';
import ContentContainer from '../../componets/ui/ContentContainer/ContentContainer';
import AddShoppingItemForm from '../../componets/AddShoppingItemForm/AddShoppingItemForm';
import SearchAndSort from '../../componets/SearchAndSort/SearchAndSort';
import FilterButtons from '../../componets/FilterButtons/FilterButtons';
import ShoppingList from '../../componets/ShoppingList/ShoppingList';
import ShareButton from '../../componets/ShareButton/ShareButton';

const HomePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.auth);
  const { items, error, searchQuery, sortBy, filter } = useAppSelector(state => state.shoppingList);
  const [searchParams, setSearchParams] = useSearchParams();

  // Sync URL params with Redux state on mount
  useEffect(() => {
    const urlSearch = searchParams.get('search') || '';
    const urlSort = searchParams.get('sort') as SortType || 'date-desc';
    const urlFilter = searchParams.get('filter') as FilterType || 'all';

    // Update Redux state from URL
    if (urlSearch !== searchQuery) {
      dispatch(setSearchQuery(urlSearch));
    }
    if (urlSort !== sortBy) {
      dispatch(setSortBy(urlSort));
    }
    if (urlFilter !== filter) {
      dispatch(setFilter(urlFilter));
    }
  }, []);

  // Update URL when Redux state changes
  useEffect(() => {
    const newParams = new URLSearchParams();
    
    if (searchQuery) {
      newParams.set('search', searchQuery);
    }
    
    if (sortBy !== 'date-desc') {
      newParams.set('sort', sortBy);
    }
    
    if (filter !== 'all') {
      newParams.set('filter', filter);
    }
    
    // Only update URL if params actually changed
    const currentParams = searchParams.toString();
    const newParamsString = newParams.toString();
    
    if (currentParams !== newParamsString) {
      setSearchParams(newParams, { replace: true });
    }
  }, [searchQuery, sortBy, filter, searchParams, setSearchParams]);

  // Fetch shopping list on component mount
  useEffect(() => {
    if (user?.id) {
      dispatch(fetchShoppingList(user.id));
    }
  }, [dispatch, user?.id]);

  // Auto-save shopping list when items change
  useEffect(() => {
    if (user?.id && items.length >= 0) {
      // Debounce saves to avoid too many API calls
      const timeoutId = setTimeout(() => {
        dispatch(saveShoppingList({ userId: user.id, items }));
      }, 1000);

      return () => clearTimeout(timeoutId);
    }
  }, [dispatch, user?.id, items]);

  if (!user) {
    return null; // This shouldn't happen due to ProtectedRoute, but just in case
  }

  return (
    <div className="home-page">
      <Navigation />
      
      <div className="home-page__container">
        {/* Header Section */}
        <ShoppingListHeader />
        
        {/* Main Content */}
        <ContentContainer variant="default" maxWidth="medium" padding="none">
          {/* Add Item Form */}
          <AddShoppingItemForm />
          
          {/* Search and Sort Controls */}
          <SearchAndSort />
          
          {/* Filter Controls */}
          <FilterButtons />
          
          {/* Share Button */}
          <ShareButton />
          
          {/* Error Display */}
          {error && (
            <ContentContainer variant="section" padding="small" className="home-page__error">
              <div className="home-page__error-content">
                <span className="home-page__error-icon">⚠️</span>
                <span className="home-page__error-text">{error}</span>
              </div>
            </ContentContainer>
          )}
          
          {/* Shopping List Items */}
          <ShoppingList />
        </ContentContainer>
        
        {/* Footer */}
        <footer className="home-page__footer">
          <ContentContainer variant="default" maxWidth="medium" padding="small">
            <p className="home-page__footer-text">
              Built with React, TypeScript, and Redux Toolkit
            </p>
          </ContentContainer>
        </footer>
      </div>
    </div>
  );
};

export default HomePage;
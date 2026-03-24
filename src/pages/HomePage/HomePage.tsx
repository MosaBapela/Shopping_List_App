// Home Page
import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { fetchShoppingList, saveShoppingList, setSearchQuery, setSortBy, setFilter } from '../../store/slices/shoppingListSlice';
import type { SortType, FilterType } from '../../types';
import Navigation from '../../componets/Navigation/Navigation';
import ShoppingListHeader from '../../componets/ShoppingListHeader/ShoppingListHeader';
import AddShoppingItemForm from '../../componets/AddShoppingItemForm/AddShoppingItemForm';
import SearchAndSort from '../../componets/SearchAndSort/SearchAndSort';
import FilterButtons from '../../componets/FilterButtons/FilterButtons';
import ShoppingList from '../../componets/ShoppingList/ShoppingList';
import ShareButton from '../../componets/ShareButton/ShareButton';
import './HomePage.css';

const HomePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(s => s.auth);
  const { items, error, searchQuery, sortBy, filter } = useAppSelector(s => s.shoppingList);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const urlSearch = searchParams.get('search') || '';
    const urlSort   = (searchParams.get('sort') as SortType) || 'date-desc';
    const urlFilter = (searchParams.get('filter') as FilterType) || 'all';
    if (urlSearch !== searchQuery) dispatch(setSearchQuery(urlSearch));
    if (urlSort   !== sortBy)      dispatch(setSortBy(urlSort));
    if (urlFilter !== filter)      dispatch(setFilter(urlFilter));
  }, []);

  useEffect(() => {
    const p = new URLSearchParams();
    if (searchQuery)          p.set('search', searchQuery);
    if (sortBy !== 'date-desc') p.set('sort', sortBy);
    if (filter !== 'all')     p.set('filter', filter);
    if (searchParams.toString() !== p.toString()) setSearchParams(p, { replace: true });
  }, [searchQuery, sortBy, filter, searchParams, setSearchParams]);

  useEffect(() => {
    if (user?.id) dispatch(fetchShoppingList(user.id));
  }, [dispatch, user?.id]);

  useEffect(() => {
    if (!user?.id) return;
    const t = setTimeout(() => dispatch(saveShoppingList({ userId: user.id, items })), 1000);
    return () => clearTimeout(t);
  }, [dispatch, user?.id, items]);

  if (!user) return null;

  return (
    <div className="home">
      <Navigation />
      <div className="home__container">
        <ShoppingListHeader />
        <AddShoppingItemForm />
        <SearchAndSort />
        <FilterButtons />
        <ShareButton />
        {error && (
          <div className="home__error">
            <span>&#9888;&#65039;</span>
            <span>{error}</span>
          </div>
        )}
        <ShoppingList />
        <p className="home__footer">Built with React, TypeScript &amp; Redux Toolkit</p>
      </div>
    </div>
  );
};

export default HomePage;

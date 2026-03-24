// Search and Sort Component
import React from 'react';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { setSearchQuery, setSortBy } from '../../store/slices/shoppingListSlice';
import type { SortType } from '../../types';
import './SearchAndSort.css';

const SearchAndSort: React.FC = () => {
  const dispatch = useAppDispatch();
  const { searchQuery, sortBy } = useAppSelector(state => state.shoppingList);

  const sortOptions: { value: SortType; label: string }[] = [
    { value: 'date-desc',     label: 'Newest first' },
    { value: 'date-asc',      label: 'Oldest first' },
    { value: 'name-asc',      label: 'Name A to Z' },
    { value: 'name-desc',     label: 'Name Z to A' },
    { value: 'category-asc',  label: 'Category A to Z' },
    { value: 'category-desc', label: 'Category Z to A' },
  ];

  return (
    <div className="search-sort">
      <div className="search-sort__search-wrap">
        <span className="search-sort__search-icon">&#128269;</span>
        <input
          type="text"
          value={searchQuery}
          onChange={e => dispatch(setSearchQuery(e.target.value))}
          placeholder="Search items..."
          className="search-sort__input"
          aria-label="Search items"
        />
        {searchQuery && (
          <button className="search-sort__clear" onClick={() => dispatch(setSearchQuery(''))} aria-label="Clear search">x</button>
        )}
      </div>

      <select
        value={sortBy}
        onChange={e => dispatch(setSortBy(e.target.value as SortType))}
        className="search-sort__select"
        aria-label="Sort items"
      >
        {sortOptions.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  );
};

export default SearchAndSort;

// Search and Sort Component
import React from 'react';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { setSearchQuery, setSortBy } from '../../store/slices/shoppingListSlice';
import type { SortType } from '../../types';
import ContentContainer from '../ui/ContentContainer/ContentContainer';
import Text from '../ui/Text/Text';
import './SearchAndSort.css';

const SearchAndSort: React.FC = () => {
  const dispatch = useAppDispatch();
  const { searchQuery, sortBy } = useAppSelector(state => state.shoppingList);

  const sortOptions: { value: SortType; label: string }[] = [
    { value: 'date-desc', label: 'Date Added (Newest)' },
    { value: 'date-asc', label: 'Date Added (Oldest)' },
    { value: 'name-asc', label: 'Name (A-Z)' },
    { value: 'name-desc', label: 'Name (Z-A)' },
    { value: 'category-asc', label: 'Category (A-Z)' },
    { value: 'category-desc', label: 'Category (Z-A)' },
  ];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchQuery(e.target.value));
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setSortBy(e.target.value as SortType));
  };

  const clearSearch = () => {
    dispatch(setSearchQuery(''));
  };

  return (
    <ContentContainer variant="section" padding="medium" className="search-sort">
      <div className="search-sort__header">
        <Text variant="h4" weight="semibold" color="primary">
          Search & Sort
        </Text>
        <Text variant="small" color="muted">
          Find and organize your items
        </Text>
      </div>

      <div className="search-sort__controls">
        {/* Search Input */}
        <div className="search-sort__search-group">
          <div className="search-sort__search-wrapper">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search items..."
              className="search-sort__search-input"
              aria-label="Search shopping items"
            />
            <div className="search-sort__search-icon">🔍</div>
            {searchQuery && (
              <button
                type="button"
                onClick={clearSearch}
                className="search-sort__clear-button"
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Sort Dropdown */}
        <div className="search-sort__sort-group">
          <label htmlFor="sort-select" className="search-sort__sort-label">
            <Text variant="small" weight="medium" color="secondary">
              Sort by:
            </Text>
          </label>
          <select
            id="sort-select"
            value={sortBy}
            onChange={handleSortChange}
            className="search-sort__sort-select"
            aria-label="Sort shopping items"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Search Results Info */}
      {searchQuery && (
        <div className="search-sort__search-info">
          <Text variant="small" color="muted">
            Searching for: <strong>"{searchQuery}"</strong>
          </Text>
        </div>
      )}
    </ContentContainer>
  );
};

export default SearchAndSort;
// Filter Buttons Component
// Provides filtering options for the shopping list
// Shows counts for each filter category

import React from 'react';
import { useAppSelector } from '../../hooks/useAppSelector';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { setFilter, type FilterType } from '../../store/slices/shoppingListSlice';
import ContentContainer from '../ui/ContentContainer/ContentContainer';
import Text from '../ui/Text/Text';
import './FilterButtons.css';

const FilterButtons: React.FC = () => {
  const { items, filter } = useAppSelector(state => state.shoppingList);
  const dispatch = useAppDispatch();

  // Calculate counts for each filter
  const allCount = items.length;
  const activeCount = items.filter(item => !item.completed).length;
  const completedCount = items.filter(item => item.completed).length;

  const filterOptions: { key: FilterType; label: string; count: number }[] = [
    { key: 'all', label: 'All Items', count: allCount },
    { key: 'active', label: 'Active', count: activeCount },
    { key: 'completed', label: 'Completed', count: completedCount },
  ];

  const handleFilterChange = (newFilter: FilterType) => {
    dispatch(setFilter(newFilter));
  };

  return (
    <ContentContainer variant="section" padding="medium" className="filter-buttons">
      <div className="filter-buttons__header">
        <Text variant="h4" weight="semibold" color="primary">
          Filter Items
        </Text>
        <Text variant="small" color="muted">
          Show items by status
        </Text>
      </div>

      <div className="filter-buttons__group">
        {filterOptions.map((option) => (
          <button
            key={option.key}
            onClick={() => handleFilterChange(option.key)}
            className={`filter-buttons__button ${
              filter === option.key ? 'filter-buttons__button--active' : ''
            }`}
          >
            <span className="filter-buttons__button-label">
              {option.label}
            </span>
            <span className="filter-buttons__button-count">
              {option.count}
            </span>
          </button>
        ))}
      </div>
    </ContentContainer>
  );
};

export default FilterButtons;
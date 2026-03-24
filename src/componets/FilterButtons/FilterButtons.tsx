// Filter Buttons Component
import React from 'react';
import { useAppSelector } from '../../hooks/useAppSelector';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { setFilter } from '../../store/slices/shoppingListSlice';
import type { FilterType } from '../../types';
import './FilterButtons.css';

const FilterButtons: React.FC = () => {
  const { items, filter } = useAppSelector(state => state.shoppingList);
  const dispatch = useAppDispatch();

  const allCount       = items.length;
  const activeCount    = items.filter(item => !item.completed).length;
  const completedCount = items.filter(item =>  item.completed).length;

  const options: { key: FilterType; label: string; count: number; icon: string }[] = [
    { key: 'all',       label: 'All',       count: allCount,       icon: '' },
    { key: 'active',    label: 'Active',    count: activeCount,    icon: '' },
    { key: 'completed', label: 'Done',      count: completedCount, icon: '' },
  ];

  return (
    <div className="filter-bar">
      {options.map(o => (
        <button
          key={o.key}
          onClick={() => dispatch(setFilter(o.key))}
          className={`filter-bar__btn ${filter === o.key ? 'filter-bar__btn--active' : ''}`}
        >
          <span className="filter-bar__icon">{o.icon}</span>
          <span className="filter-bar__label">{o.label}</span>
          <span className="filter-bar__badge">{o.count}</span>
        </button>
      ))}
    </div>
  );
};

export default FilterButtons;

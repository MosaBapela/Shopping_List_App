// Shopping List Component - Enhanced with search and sort functionality
// Main container for displaying filtered shopping list items
// Handles empty states and provides bulk actions

import React from 'react';
import { useAppSelector } from '../../hooks/useAppSelector';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { clearCompleted, toggleAll } from '../../store/slices/shoppingListSlice';
import type { ShoppingItem } from '../../types';
import ContentContainer from '../ui/ContentContainer/ContentContainer';
import Text from '../ui/Text/Text';
import ShoppingListItem from '../ShoppingListItem/ShoppingListItem';
import './ShoppingList.css';

const ShoppingList: React.FC = () => {
  const { items, filter, searchQuery, sortBy } = useAppSelector(state => state.shoppingList);
  const dispatch = useAppDispatch();

  // Helper function to filter items by search query
  const filterBySearch = (items: ShoppingItem[]): ShoppingItem[] => {
    if (!searchQuery.trim()) return items;
    
    const query = searchQuery.toLowerCase().trim();
    return items.filter(item => 
      item.text.toLowerCase().includes(query) ||
      (item.category && item.category.toLowerCase().includes(query)) ||
      (item.notes && item.notes.toLowerCase().includes(query))
    );
  };

  // Helper function to sort items
  const sortItems = (items: ShoppingItem[]): ShoppingItem[] => {
    const sortedItems = [...items];
    
    switch (sortBy) {
      case 'name-asc':
        return sortedItems.sort((a, b) => a.text.localeCompare(b.text));
      case 'name-desc':
        return sortedItems.sort((a, b) => b.text.localeCompare(a.text));
      case 'category-asc':
        return sortedItems.sort((a, b) => {
          const categoryA = a.category || 'zzz'; // Put items without category at the end
          const categoryB = b.category || 'zzz';
          return categoryA.localeCompare(categoryB);
        });
      case 'category-desc':
        return sortedItems.sort((a, b) => {
          const categoryA = a.category || ''; // Put items without category at the beginning
          const categoryB = b.category || '';
          return categoryB.localeCompare(categoryA);
        });
      case 'date-asc':
        return sortedItems.sort((a, b) => a.createdAt - b.createdAt);
      case 'date-desc':
      default:
        return sortedItems.sort((a, b) => b.createdAt - a.createdAt);
    }
  };

  // Filter items based on current filter
  const filteredByStatus = items.filter(item => {
    switch (filter) {
      case 'active':
        return !item.completed;
      case 'completed':
        return item.completed;
      default:
        return true;
    }
  });

  // Apply search filter
  const searchFiltered = filterBySearch(filteredByStatus);

  // Apply sorting (but keep completed items separate for better UX)
  const activeItems = searchFiltered.filter(item => !item.completed);
  const completedItems = searchFiltered.filter(item => item.completed);
  
  const sortedActiveItems = sortItems(activeItems);
  const sortedCompletedItems = sortItems(completedItems);
  
  // Combine: active items first, then completed items
  const finalItems = [...sortedActiveItems, ...sortedCompletedItems];

  const hasItems = items.length > 0;
  const hasCompletedItems = items.some(item => item.completed);
  const hasActiveItems = items.some(item => !item.completed);
  const allCompleted = hasItems && items.every(item => item.completed);

  const handleClearCompleted = () => {
    dispatch(clearCompleted());
  };

  const handleToggleAll = () => {
    dispatch(toggleAll());
  };

  const getEmptyMessage = () => {
    if (searchQuery) {
      return `No items found matching "${searchQuery}"`;
    }
    
    switch (filter) {
      case 'active':
        return hasItems ? "All items completed! 🎉" : "No active items";
      case 'completed':
        return "No completed items yet";
      default:
        return "Your shopping list is empty. Add some items to get started!";
    }
  };

  const getFilterTitle = () => {
    let title = '';
    switch (filter) {
      case 'active':
        title = 'Active Items';
        break;
      case 'completed':
        title = 'Completed Items';
        break;
      default:
        title = 'All Items';
    }
    
    if (searchQuery) {
      title += ` matching "${searchQuery}"`;
    }
    
    return title;
  };

  return (
    <div className="shopping-list">
      {/* Bulk Actions */}
      {hasItems && (
        <ContentContainer variant="section" padding="small" className="shopping-list__actions">
          <div className="shopping-list__actions-content">
            <div className="shopping-list__actions-left">
              <Text variant="small" weight="medium" color="secondary">
                {getFilterTitle()} ({finalItems.length})
              </Text>
            </div>
            
            <div className="shopping-list__actions-right">
              {hasActiveItems && (
                <button
                  onClick={handleToggleAll}
                  className="shopping-list__bulk-action"
                >
                  <Text variant="small" weight="medium">
                    {allCompleted ? 'Mark All Active' : 'Mark All Complete'}
                  </Text>
                </button>
              )}
              
              {hasCompletedItems && (
                <button
                  onClick={handleClearCompleted}
                  className="shopping-list__bulk-action shopping-list__bulk-action--danger"
                >
                  <Text variant="small" weight="medium" color="error">
                    Clear Completed
                  </Text>
                </button>
              )}
            </div>
          </div>
        </ContentContainer>
      )}

      {/* Items List */}
      <ContentContainer variant="default" padding="none">
        {finalItems.length === 0 ? (
          <div className="shopping-list__empty">
            <div className="shopping-list__empty-icon">
              {searchQuery ? '🔍' : (filter === 'completed' ? '✅' : '📝')}
            </div>
            <Text variant="h3" weight="semibold" color="secondary" align="center">
              {getEmptyMessage()}
            </Text>
            {!hasItems && !searchQuery && (
              <Text variant="body" color="muted" align="center">
                Start by adding your first item using the form above
              </Text>
            )}
            {searchQuery && (
              <Text variant="body" color="muted" align="center">
                Try adjusting your search terms or check the spelling
              </Text>
            )}
          </div>
        ) : (
          <div className="shopping-list__items">
            {finalItems.map((item, index) => (
              <ShoppingListItem 
                key={item.id} 
                item={item} 
                index={index}
              />
            ))}
          </div>
        )}
      </ContentContainer>
    </div>
  );
};

export default ShoppingList;
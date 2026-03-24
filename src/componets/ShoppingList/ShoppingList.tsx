// Shopping List Component
import React from 'react';
import { useAppSelector } from '../../hooks/useAppSelector';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { clearCompleted, toggleAll } from '../../store/slices/shoppingListSlice';
import type { ShoppingItem } from '../../types';
import ShoppingListItem from '../ShoppingListItem/ShoppingListItem';
import './ShoppingList.css';

const ShoppingList: React.FC = () => {
  const { items, filter, searchQuery, sortBy } = useAppSelector(s => s.shoppingList);
  const dispatch = useAppDispatch();

  const filterBySearch = (arr: ShoppingItem[]) => {
    if (!searchQuery.trim()) return arr;
    const q = searchQuery.toLowerCase();
    return arr.filter(i =>
      i.text.toLowerCase().includes(q) ||
      (i.category && i.category.toLowerCase().includes(q)) ||
      (i.notes && i.notes.toLowerCase().includes(q))
    );
  };

  const sortItems = (arr: ShoppingItem[]) => {
    const s = [...arr];
    switch (sortBy) {
      case 'name-asc':      return s.sort((a,b) => a.text.localeCompare(b.text));
      case 'name-desc':     return s.sort((a,b) => b.text.localeCompare(a.text));
      case 'category-asc':  return s.sort((a,b) => (a.category||'zzz').localeCompare(b.category||'zzz'));
      case 'category-desc': return s.sort((a,b) => (b.category||'').localeCompare(a.category||''));
      case 'date-asc':      return s.sort((a,b) => a.createdAt - b.createdAt);
      default:              return s.sort((a,b) => b.createdAt - a.createdAt);
    }
  };

  const byStatus = items.filter(i => {
    if (filter === 'active')    return !i.completed;
    if (filter === 'completed') return  i.completed;
    return true;
  });

  const searched  = filterBySearch(byStatus);
  const active    = sortItems(searched.filter(i => !i.completed));
  const completed = sortItems(searched.filter(i =>  i.completed));
  const final     = [...active, ...completed];

  const hasItems     = items.length > 0;
  const hasDone      = items.some(i =>  i.completed);
  const hasActive    = items.some(i => !i.completed);
  const allCompleted = hasItems && items.every(i => i.completed);

  const emptyMsg = () => {
    if (searchQuery) return `No items match "${searchQuery}"`;
    if (filter === 'active')    return hasItems ? 'All items completed!' : 'No active items';
    if (filter === 'completed') return 'No completed items yet';
    return 'Your shopping list is empty';
  };

  return (
    <div className="sl-list">
      {hasItems && (
        <div className="sl-list__toolbar">
          <span className="sl-list__toolbar-label">
            {final.length} item{final.length !== 1 ? 's' : ''}
            {searchQuery ? ` matching "${searchQuery}"` : ''}
          </span>
          <div className="sl-list__toolbar-actions">
            {hasActive && (
              <button className="sl-list__bulk-btn" onClick={() => dispatch(toggleAll())}>
                {allCompleted ? 'Mark all active' : 'Mark all done'}
              </button>
            )}
            {hasDone && (
              <button className="sl-list__bulk-btn sl-list__bulk-btn--danger" onClick={() => dispatch(clearCompleted())}>
                Clear done
              </button>
            )}
          </div>
        </div>
      )}

      {final.length === 0 ? (
        <div className="sl-list__empty">
          <div className="sl-list__empty-icon">{searchQuery ? '&#128269;' : filter === 'completed' ? '&#9989;' : '&#128203;'}</div>
          <p className="sl-list__empty-title">{emptyMsg()}</p>
          {!hasItems && !searchQuery && (
            <p className="sl-list__empty-sub">Add your first item using the form above</p>
          )}
        </div>
      ) : (
        <div>
          {final.map((item, i) => (
            <ShoppingListItem key={item.id} item={item} index={i} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ShoppingList;

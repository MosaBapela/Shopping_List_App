import React from 'react';
import { useAppSelector } from '../../hooks/useAppSelector';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { clearCompleted, toggleAll } from '../../store/slices/shoppingListSlice';
import type { ShoppingItem } from '../../types';
import ShoppingListItem from '../ShoppingListItem/ShoppingListItem';
import './ShoppingList.css';

const IconSearch = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const IconCheckAll = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const IconClipboard = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
  </svg>
);

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
          <div className="sl-list__empty-icon">
            {searchQuery ? <IconSearch /> : filter === 'completed' ? <IconCheckAll /> : <IconClipboard />}
          </div>
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

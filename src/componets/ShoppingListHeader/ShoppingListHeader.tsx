import React from 'react';
import { useAppSelector } from '../../hooks/useAppSelector';
import './ShoppingListHeader.css';

const ShoppingListHeader: React.FC = () => {
  const { items } = useAppSelector(state => state.shoppingList);

  const totalItems     = items.length;
  const completedItems = items.filter(item => item.completed).length;
  const pendingItems   = totalItems - completedItems;
  const pct = totalItems === 0 ? 0 : Math.round((completedItems / totalItems) * 100);

  return (
    <div className="sl-header">
      <p className="sl-header__title">🛒 My Shopping List</p>
      <p className="sl-header__sub">Stay organised, shop smarter</p>

      <div className="sl-header__stats">
        <div className="sl-header__stat">
          <span className="sl-header__stat-value">{totalItems}</span>
          <span className="sl-header__stat-label">Total</span>
        </div>
        <div className="sl-header__stat">
          <span className="sl-header__stat-value">{pendingItems}</span>
          <span className="sl-header__stat-label">Pending</span>
        </div>
        <div className="sl-header__stat">
          <span className="sl-header__stat-value">{completedItems}</span>
          <span className="sl-header__stat-label">Done</span>
        </div>
      </div>

      {totalItems > 0 && (
        <div className="sl-header__progress-wrap">
          <div className="sl-header__progress-label">
            <span>Progress</span>
            <span>{pct}%</span>
          </div>
          <div className="sl-header__progress-bar">
            <div className="sl-header__progress-fill" style={{ width: `${pct}%` }} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ShoppingListHeader;

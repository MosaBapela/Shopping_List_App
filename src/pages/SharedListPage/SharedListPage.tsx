import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { fetchSharedList } from '../../store/slices/shoppingListSlice';
import './SharedListPage.css';

const SharedListPage: React.FC = () => {
  const { shareToken } = useParams<{ shareToken: string }>();
  const dispatch = useAppDispatch();
  const { isLoading, error, sharedData } = useAppSelector(state => state.shoppingList);

  useEffect(() => {
    if (shareToken) dispatch(fetchSharedList(shareToken));
  }, [dispatch, shareToken]);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });

  const formatItemDate = (timestamp: number) =>
    new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });

  if (isLoading) {
    return (
      <div className="shared-page">
        <div className="shared-page__loading">
          <span className="shared-page__spinner" />
          <p>Loading shared shopping list&hellip;</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="shared-page">
        <div className="shared-page__state-card">
          <div className="shared-page__state-icon shared-page__state-icon--error">&#10060;</div>
          <h2 className="shared-page__state-title">Failed to Load</h2>
          <p className="shared-page__state-sub">{error}</p>
          <Link to="/" className="shared-page__cta-btn">Go to Home</Link>
        </div>
      </div>
    );
  }

  if (!sharedData) return null;

  const completedCount = sharedData.items.filter(i => i.completed).length;
  const totalCount = sharedData.items.length;
  const pct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const sortedItems = [...sharedData.items].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    return b.createdAt - a.createdAt;
  });

  return (
    <div className="shared-page">
      {/* Header banner */}
      <div className="shared-page__banner">        <div className="shared-page__banner-inner">
          <p className="shared-page__banner-label">Shared Shopping List</p>
          <h1 className="shared-page__banner-title">
            {sharedData.ownerName}&apos;s List
          </h1>
          <p className="shared-page__banner-date">Shared on {formatDate(sharedData.createdAt)}</p>

          <div className="shared-page__stats">
            <div className="shared-page__stat">
              <span className="shared-page__stat-num">{totalCount}</span>
              <span className="shared-page__stat-lbl">Total</span>
            </div>
            <div className="shared-page__stat">
              <span className="shared-page__stat-num">{totalCount - completedCount}</span>
              <span className="shared-page__stat-lbl">Pending</span>
            </div>
            <div className="shared-page__stat">
              <span className="shared-page__stat-num">{completedCount}</span>
              <span className="shared-page__stat-lbl">Done</span>
            </div>
          </div>

          {totalCount > 0 && (
            <div className="shared-page__progress-wrap">
              <div className="shared-page__progress-fill" style={{ width: `${pct}%` }} />
            </div>
          )}
        </div>
      </div>

      <div className="shared-page__content">
        {sortedItems.length === 0 ? (
          <div className="shared-page__state-card">
            <div className="shared-page__state-icon">&#128203;</div>
            <h2 className="shared-page__state-title">This list is empty</h2>
            <p className="shared-page__state-sub">The owner has not added any items yet.</p>
          </div>
        ) : (
          <ul className="shared-page__list">
            {sortedItems.map((item, idx) => (
              <li
                key={item.id}
                className={`shared-page__item${item.completed ? ' shared-page__item--done' : ''}`}
                style={{ animationDelay: `${idx * 0.04}s` }}
              >
                <span className={`shared-page__checkbox${item.completed ? ' shared-page__checkbox--checked' : ''}`}>
                  {item.completed && '&#10003;'}
                </span>

                <div className="shared-page__item-body">
                  <span className="shared-page__item-name">{item.text}</span>

                  <div className="shared-page__item-meta">
                    {item.quantity > 1 && <span className="shared-page__meta-chip">Qty: {item.quantity}</span>}
                    {item.category && (
                      <span className={`shared-page__meta-chip shared-page__cat--${item.category}`}>
                        {item.category}
                      </span>
                    )}
                  </div>

                  {item.notes && <p className="shared-page__item-notes">{item.notes}</p>}

                  {item.images && item.images.length > 0 && (
                    <div className="shared-page__item-images">
                      {item.images.slice(0, 3).map((url: string, i: number) => (
                        <img key={i} src={url} alt={`img ${i + 1}`} className="shared-page__item-thumb"
                          onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                      ))}
                      {item.images.length > 3 && (
                        <span className="shared-page__item-more">+{item.images.length - 3}</span>
                      )}
                    </div>
                  )}

                  <p className="shared-page__item-date">
                    {item.updatedAt !== item.createdAt ? 'Updated' : 'Added'} {formatItemDate(item.updatedAt)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}

        <div className="shared-page__footer">
          <p className="shared-page__footer-note">This is a read-only shared list.</p>
          <Link to="/" className="shared-page__cta-btn">&#43; Create Your Own List</Link>
        </div>
      </div>
    </div>
  );
};

export default SharedListPage;

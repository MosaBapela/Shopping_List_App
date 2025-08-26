// Shared List Page Component - For viewing shared shopping lists
import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { fetchSharedList } from '../../store/slices/shoppingListSlice';
import ContentContainer from '../../componets/ui/ContentContainer/ContentContainer';
import Text from '../../componets/ui/Text/Text';
import './SharedListPage.css';

const SharedListPage: React.FC = () => {
  const { shareToken } = useParams<{ shareToken: string }>();
  const dispatch = useAppDispatch();
  const { isLoading, error, sharedData } = useAppSelector(state => state.shoppingList);

  useEffect(() => {
    if (shareToken) {
      dispatch(fetchSharedList(shareToken));
    }
  }, [dispatch, shareToken]);

  if (isLoading) {
    return (
      <div className="shared-list-page">
        <div className="shared-list-page__container">
          <ContentContainer variant="card" padding="large" maxWidth="medium">
            <div className="shared-list-page__loading">
              <div className="shared-list-page__spinner" />
              <Text variant="body" color="muted" align="center">
                Loading shared shopping list...
              </Text>
            </div>
          </ContentContainer>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="shared-list-page">
        <div className="shared-list-page__container">
          <ContentContainer variant="card" padding="large" maxWidth="medium">
            <div className="shared-list-page__error">
              <div className="shared-list-page__error-icon">❌</div>
              <Text variant="h3" weight="semibold" color="error" align="center">
                Failed to Load Shared List
              </Text>
              <Text variant="body" color="muted" align="center">
                {error}
              </Text>
              <div className="shared-list-page__error-actions">
                <Link to="/" className="shared-list-page__home-link">
                  <Text variant="body" weight="medium" color="primary">
                    Go to Home
                  </Text>
                </Link>
              </div>
            </div>
          </ContentContainer>
        </div>
      </div>
    );
  }

  if (!sharedData) {
    return null;
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatItemDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const completedItems = sharedData.items.filter(item => item.completed).length;
  const totalItems = sharedData.items.length;

  return (
    <div className="shared-list-page">
      <div className="shared-list-page__container">
        {/* Header */}
        <ContentContainer variant="header" padding="large" className="shared-list-page__header">
          <div className="shared-list-page__header-content">
            <Text variant="h1" weight="bold" color="white" align="center">
              Shared Shopping List
            </Text>
            <Text variant="body" color="white" align="center" className="shared-list-page__subtitle">
              Shared by {sharedData.ownerName}
            </Text>
            <Text variant="small" color="white" align="center" className="shared-list-page__date">
              Created on {formatDate(sharedData.createdAt)}
            </Text>

            {/* Stats */}
            <div className="shared-list-page__stats">
              <div className="shared-list-page__stat">
                <Text variant="h3" weight="bold" color="white">
                  {totalItems}
                </Text>
                <Text variant="small" color="white">
                  Total Items
                </Text>
              </div>
              
              <div className="shared-list-page__stat">
                <Text variant="h3" weight="bold" color="white">
                  {totalItems - completedItems}
                </Text>
                <Text variant="small" color="white">
                  Pending
                </Text>
              </div>
              
              <div className="shared-list-page__stat">
                <Text variant="h3" weight="bold" color="white">
                  {completedItems}
                </Text>
                <Text variant="small" color="white">
                  Completed
                </Text>
              </div>
            </div>
          </div>
        </ContentContainer>

        {/* Items List */}
        <ContentContainer variant="default" maxWidth="medium" padding="none">
          {sharedData.items.length === 0 ? (
            <div className="shared-list-page__empty">
              <div className="shared-list-page__empty-icon">📝</div>
              <Text variant="h3" weight="semibold" color="secondary" align="center">
                This shared list is empty
              </Text>
              <Text variant="body" color="muted" align="center">
                The list owner hasn't added any items yet.
              </Text>
            </div>
          ) : (
            <div className="sharedListPage__items">
              {sharedData.items
                .sort((a, b) => {
                  // Sort by completion status first, then by date
                  if (a.completed !== b.completed) {
                    return a.completed ? 1 : -1;
                  }
                  return b.createdAt - a.createdAt;
                })
                .map((item, index) => (
                  <div 
                    key={item.id} 
                    className={`shared-list-page__item ${item.completed ? 'shared-list-page__item--completed' : ''}`}
                    style={{ '--animation-delay': `${index * 0.05}s` } as React.CSSProperties}
                  >
                    <div className="shared-list-page__item-content">
                      <div className="shared-list-page__item-main">
                        <div className="shared-list-page__item-checkbox">
                          <span className={`shared-list-page__checkbox-display ${item.completed ? 'shared-list-page__checkbox-display--checked' : ''}`}>
                            {item.completed && '✓'}
                          </span>
                        </div>

                        <div className="shared-list-page__item-details">
                          <Text
                            variant="body"
                            weight="medium"
                            color={item.completed ? 'muted' : 'primary'}
                            className={`shared-list-page__item-text ${item.completed ? 'shared-list-page__item-text--completed' : ''}`}
                          >
                            {item.text}
                          </Text>
                          
                          {item.quantity > 1 && (
                            <Text variant="caption" color="muted" className="shared-list-page__item-quantity">
                              Quantity: {item.quantity}
                            </Text>
                          )}
                          
                          {item.category && (
                            <Text variant="caption" color="muted" className="shared-list-page__item-category">
                              Category: {item.category}
                            </Text>
                          )}
                          
                          {item.notes && (
                            <Text variant="caption" color="muted" className="shared-list-page__item-notes">
                              Notes: {item.notes}
                            </Text>
                          )}
                          
                          {item.images && item.images.length > 0 && (
                            <div className="shared-list-page__item-images">
                              {item.images.slice(0, 3).map((url: string, index: number) => (
                                <img 
                                  key={index} 
                                  src={url} 
                                  alt={`Item image ${index + 1}`} 
                                  className="shared-list-page__item-image" 
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).style.display = 'none';
                                  }}
                                />
                              ))}
                              {item.images.length > 3 && (
                                <span className="shared-list-page__item-image-count">
                                  +{item.images.length - 3} more
                                </span>
                              )}
                            </div>
                          )}
                          
                          <Text variant="caption" color="muted" className="shared-list-page__item-date">
                            {item.updatedAt !== item.createdAt ? 'Updated' : 'Added'} {formatItemDate(item.updatedAt)}
                          </Text>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </ContentContainer>

        {/* Footer */}
        <ContentContainer variant="default" maxWidth="medium" padding="medium">
          <div className="shared-list-page__footer">
            <Text variant="small" color="muted" align="center">
              This is a read-only view of a shared shopping list.
            </Text>
            <div className="shared-list-page__footer-actions">
              <Link to="/" className="shared-list-page__home-link">
                <button className="shared-list-page__home-button">
                  <Text variant="body" weight="medium" color="white">
                    Create Your Own List
                  </Text>
                </button>
              </Link>
            </div>
          </div>
        </ContentContainer>
      </div>
    </div>
  );
};

export default SharedListPage;

// Share Button Component for sharing shopping lists
import React, { useState } from 'react';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { generateShareToken, clearShareToken } from '../../store/slices/shoppingListSlice';
import ContentContainer from '../ui/ContentContainer/ContentContainer';
import Text from '../ui/Text/Text';
import './ShareButton.css';

const ShareButton: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.auth);
  const { items, shareToken, isLoading } = useAppSelector(state => state.shoppingList);
  const [copied, setCopied] = useState(false);

  const handleGenerateShareLink = async () => {
    if (!user?.id || items.length === 0) return;

    dispatch(generateShareToken({ userId: user.id, items }));
  };

  const handleCopyLink = async () => {
    if (!shareToken) return;

    const shareUrl = `${window.location.origin}/shared/${shareToken}`;
    
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = shareUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleCloseShare = () => {
    dispatch(clearShareToken());
    setCopied(false);
  };

  if (items.length === 0) {
    return null; // Don't show share button if no items
  }

  return (
    <ContentContainer variant="section" padding="medium" className="share-button">
      <div className="share-button__content">
        <div className="share-button__header">
          <Text variant="h4" weight="semibold" color="primary">
            Share Your List
          </Text>
          <Text variant="small" color="muted">
            Create a shareable link for your shopping list
          </Text>
        </div>

        {!shareToken ? (
          <div className="share-button__actions">
            <button
              onClick={handleGenerateShareLink}
              disabled={isLoading}
              className="share-button__generate"
            >
              {isLoading ? (
                <div className="share-button__spinner" />
              ) : (
                <>
                  <span className="share-button__icon">🔗</span>
                  <Text variant="body" weight="medium" color="white">
                    Generate Share Link
                  </Text>
                </>
              )}
            </button>
          </div>
        ) : (
          <div className="share-button__share-section">
            <div className="share-button__link-container">
              <Text variant="small" color="secondary" weight="medium">
                Share this link with others:
              </Text>
              <div className="share-button__link-wrapper">
                <input
                  type="text"
                  value={`${window.location.origin}/shared/${shareToken}`}
                  readOnly
                  className="share-button__link-input"
                />
                <button
                  onClick={handleCopyLink}
                  className={`share-button__copy ${copied ? 'share-button__copy--copied' : ''}`}
                >
                  {copied ? '✓' : '📋'}
                </button>
              </div>
              {copied && (
                <Text variant="small" color="success" className="share-button__copy-success">
                  Link copied to clipboard!
                </Text>
              )}
            </div>

            <div className="share-button__share-actions">
              <button
                onClick={handleCopyLink}
                className="share-button__action-button share-button__action-button--primary"
              >
                <Text variant="small" weight="medium" color="white">
                  Copy Link
                </Text>
              </button>
              
              <button
                onClick={handleCloseShare}
                className="share-button__action-button share-button__action-button--secondary"
              >
                <Text variant="small" weight="medium" color="secondary">
                  Close
                </Text>
              </button>
            </div>

            <div className="share-button__info">
              <Text variant="caption" color="muted">
                Anyone with this link can view your shopping list. The shared list is read-only.
              </Text>
            </div>
          </div>
        )}
      </div>
    </ContentContainer>
  );
};

export default ShareButton;
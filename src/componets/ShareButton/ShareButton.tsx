// Share Button Component
import React, { useState } from 'react';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { generateShareToken, clearShareToken } from '../../store/slices/shoppingListSlice';
import './ShareButton.css';

const ShareButton: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user }  = useAppSelector(state => state.auth);
  const { items, shareToken, isLoading } = useAppSelector(state => state.shoppingList);
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    if (!user?.id || items.length === 0) return;
    dispatch(generateShareToken({ userId: user.id, items }));
  };

  const handleCopy = async () => {
    if (!shareToken) return;
    const url = `${window.location.origin}/shared/${shareToken}`;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = url;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (items.length === 0) return null;

  return (
    <div className="share-panel">
      {!shareToken ? (
        <button onClick={handleGenerate} disabled={isLoading} className="share-panel__generate-btn">
          {isLoading ? <span className="share-panel__spinner" /> : <span>&#128279;</span>}
          <span>{isLoading ? 'Generating' : 'Share this list'}</span>
        </button>
      ) : (
        <div className="share-panel__result">
          <div className="share-panel__url-row">
            <input
              type="text"
              readOnly
              value={`${window.location.origin}/shared/${shareToken}`}
              className="share-panel__url-input"
            />
            <button onClick={handleCopy} className={`share-panel__copy-btn ${copied ? 'share-panel__copy-btn--copied' : ''}`}>
              {copied ? ' Copied' : ' Copy'}
            </button>
          </div>
          <div className="share-panel__actions">
            <span className="share-panel__hint">Anyone with this link can view your list (read-only)</span>
            <button onClick={() => { dispatch(clearShareToken()); setCopied(false); }} className="share-panel__close-btn">
              Dismiss
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShareButton;

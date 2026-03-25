import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { addItem } from '../../store/slices/shoppingListSlice';
import ContentContainer from '../ui/ContentContainer/ContentContainer';
import Text from '../ui/Text/Text';
import './AddItemForm.css';

const AddItemForm: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useAppDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedValue = inputValue.trim();
    if (!trimmedValue) return;

    setIsSubmitting(true);

    try {
      const newId = uuidv4();
      dispatch(addItem({ id: newId, text: trimmedValue }));
      setInputValue('');
      await new Promise(resolve => setTimeout(resolve, 200));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  return (
    <ContentContainer variant="card" padding="medium" className="add-item-form">
      <form onSubmit={handleSubmit} className="add-item-form__form">
        <div className="add-item-form__input-group">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Add a new item to your shopping list..."
            className="add-item-form__input"
            disabled={isSubmitting}
            maxLength={100}
            autoFocus
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isSubmitting}
            className={`add-item-form__button ${isSubmitting ? 'add-item-form__button--loading' : ''}`}
          >
            {isSubmitting ? (
              <div className="add-item-form__spinner" />
            ) : (
              <>
                <span className="add-item-form__button-icon">+</span>
                <span className="add-item-form__button-text">Add Item</span>
              </>
            )}
          </button>
        </div>

        <div className="add-item-form__hint">
          <Text variant="small" color="muted">
            Press Enter or click "Add Item" to add to your list
          </Text>
        </div>
      </form>
    </ContentContainer>
  );
};

export default AddItemForm;
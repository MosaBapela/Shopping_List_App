// Add Shopping Item Form Component - Enhanced with file upload support
// Enhanced form for adding shopping items with all new fields

import React, { useState, useRef, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { addItem } from '../../store/slices/shoppingListSlice';
import {
  setAddItemFormField,
  setAddItemFormErrors,
  clearAddItemForm,
  setAddItemFormSubmitting
} from '../../store/slices/formSlice';
import ContentContainer from '../ui/ContentContainer/ContentContainer';
import Text from '../ui/Text/Text';
import './AddShoppingItemForm.css';

interface AddShoppingItemFormProps {
  onCancel?: () => void;
  showCancelButton?: boolean;
}

const CATEGORIES = [
  { value: '', label: 'Select Category' },
  { value: 'grocery', label: 'Grocery' },
  { value: 'household', label: 'Household' },
  { value: 'electronics', label: 'Electronics' },
  { value: 'clothing', label: 'Clothing' },
  { value: 'other', label: 'Other' }
];

const AddShoppingItemForm: React.FC<AddShoppingItemFormProps> = ({ 
  onCancel, 
  showCancelButton = false 
}) => {
  const [imageUrl, setImageUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dispatch = useAppDispatch();
  const { addItemForm } = useAppSelector(state => state.form);
  const { isSubmitting, errors, ...formData } = addItemForm;

  useEffect(() => {
    // Clean up form state when component unmounts
    return () => {
      dispatch(clearAddItemForm());
    };
  }, [dispatch]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.text.trim()) {
      newErrors.text = 'Item name is required';
    }

    if (formData.quantity <= 0) {
      newErrors.quantity = 'Quantity must be greater than 0';
    }

    dispatch(setAddItemFormErrors(newErrors));
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    dispatch(setAddItemFormSubmitting(true));

    try {
      const newId = uuidv4();
      dispatch(addItem({
        id: newId,
        text: formData.text.trim(),
        quantity: formData.quantity,
        notes: formData.notes.trim(),
        category: formData.category,
        images: formData.images
      }));

      // Reset form
      dispatch(clearAddItemForm());
      setImageUrl('');

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      // Small delay for better UX
      await new Promise(resolve => setTimeout(resolve, 200));
    } finally {
      dispatch(setAddItemFormSubmitting(false));
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    dispatch(setAddItemFormField({ field, value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      dispatch(setAddItemFormErrors({ ...errors, [field]: '' }));
    }
  };

  const handleQuantityChange = (change: number) => {
    const newQuantity = Math.max(1, formData.quantity + change);
    handleInputChange('quantity', newQuantity);
  };

  const addImageFromUrl = () => {
    if (imageUrl.trim()) {
      const updatedImages = [...formData.images, imageUrl.trim()];
      dispatch(setAddItemFormField({ field: 'images', value: updatedImages }));
      setImageUrl('');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        dispatch(setAddItemFormErrors({ ...errors, image: 'Please select an image file' }));
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        dispatch(setAddItemFormErrors({ ...errors, image: 'Image size must be less than 5MB' }));
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (result) {
          const updatedImages = [...formData.images, result];
          dispatch(setAddItemFormField({ field: 'images', value: updatedImages }));
          dispatch(setAddItemFormErrors({ ...errors, image: '' }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (index: number) => {
    const updatedImages = formData.images.filter((_, i) => i !== index);
    dispatch(setAddItemFormField({ field: 'images', value: updatedImages }));
  };

  const handleImageKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addImageFromUrl();
    }
  };

  return (
    <ContentContainer variant="card" padding="medium" className="add-shopping-item-form">
      <form onSubmit={handleSubmit} className="add-shopping-item-form__form">
        {/* Item Name */}
        <div className="add-shopping-item-form__field">
          <label htmlFor="item-name" className="add-shopping-item-form__label">
            Item Name <span className="add-shopping-item-form__required">*</span>
          </label>
          <input
            id="item-name"
            type="text"
            value={formData.text}
            onChange={(e) => handleInputChange('text', e.target.value)}
            placeholder="Enter item name..."
            className="add-shopping-item-form__input"
            disabled={isSubmitting}
            maxLength={100}
            autoFocus
          />
          {errors.text && <span className="add-shopping-item-form__error">{errors.text}</span>}
        </div>

        {/* Quantity */}
        <div className="add-shopping-item-form__field">
          <label htmlFor="quantity" className="add-shopping-item-form__label">
            Quantity
          </label>
          <div className="add-shopping-item-form__quantity-group">
            <button
              type="button"
              onClick={() => handleQuantityChange(-1)}
              className="add-shopping-item-form__quantity-button"
              disabled={formData.quantity <= 1 || isSubmitting}
            >
              -
            </button>
            <input
              id="quantity"
              type="number"
              value={formData.quantity}
              onChange={(e) => handleInputChange('quantity', parseInt(e.target.value) || 1)}
              min="1"
              className="add-shopping-item-form__input add-shopping-item-form__quantity-input"
              disabled={isSubmitting}
            />
            <button
              type="button"
              onClick={() => handleQuantityChange(1)}
              className="add-shopping-item-form__quantity-button"
              disabled={isSubmitting}
            >
              +
            </button>
          </div>
          {errors.quantity && <span className="add-shopping-item-form__error">{errors.quantity}</span>}
        </div>

        {/* Category */}
        <div className="add-shopping-item-form__field">
          <label htmlFor="category" className="add-shopping-item-form__label">
            Category
          </label>
          <select
            id="category"
            value={formData.category}
            onChange={(e) => handleInputChange('category', e.target.value)}
            className="add-shopping-item-form__select"
            disabled={isSubmitting}
          >
            {CATEGORIES.map(cat => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        {/* Notes */}
        <div className="add-shopping-item-form__field">
          <label htmlFor="notes" className="add-shopping-item-form__label">
            Notes
          </label>
          <textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => handleInputChange('notes', e.target.value)}
            placeholder="Add any additional notes..."
            className="add-shopping-item-form__textarea"
            disabled={isSubmitting}
            maxLength={500}
          />
        </div>

        {/* Images */}
        <div className="add-shopping-item-form__field">
          <label htmlFor="images" className="add-shopping-item-form__label">
            Images
          </label>
          <div className="add-shopping-item-form__images-group">
            {/* File Upload */}
            <div className="add-shopping-item-form__file-upload">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="add-shopping-item-form__file-input"
                style={{ display: 'none' }}
                disabled={isSubmitting}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="add-shopping-item-form__upload-button"
                disabled={isSubmitting}
              >
                📷 Upload Image
              </button>
            </div>

            {/* URL Input */}
            <div className="add-shopping-item-form__url-section">
              <Text variant="small" color="muted">or enter image URL:</Text>
              <div className="add-shopping-item-form__url-input-group">
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  onKeyPress={handleImageKeyPress}
                  placeholder="Enter image URL..."
                  className="add-shopping-item-form__input"
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  onClick={addImageFromUrl}
                  className="add-shopping-item-form__add-url-button"
                  disabled={!imageUrl.trim() || isSubmitting}
                >
                  Add
                </button>
              </div>
            </div>

            {errors.image && <span className="add-shopping-item-form__error">{errors.image}</span>}
            
            {formData.images.length > 0 && (
              <div className="add-shopping-item-form__image-preview">
                {formData.images.map((url, index) => (
                  <div key={index} className="add-shopping-item-form__image-item">
                    <img
                      src={url}
                      alt={`Item ${index + 1}`}
                      className="add-shopping-item-form__image"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="add-shopping-item-form__remove-image"
                      disabled={isSubmitting}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="add-shopping-item-form__actions">
          {showCancelButton && (
            <button
              type="button"
              onClick={onCancel}
              className="add-shopping-item-form__cancel-button"
              disabled={isSubmitting}
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={!formData.text.trim() || isSubmitting}
            className="add-shopping-item-form__submit-button"
          >
            {isSubmitting ? 'Adding...' : 'Add Item'}
          </button>
        </div>
      </form>
    </ContentContainer>
  );
};

export default AddShoppingItemForm;
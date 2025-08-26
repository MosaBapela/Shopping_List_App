// Shopping List Item Component - Enhanced with full editing capabilities
// Represents a single item in the shopping list
// Handles editing, toggling, and deleting items with all new fields

import React, { useRef, useEffect } from 'react';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import {
  toggleItem,
  deleteItem,
  startEditing,
  cancelEditing,
  updateItem,
} from '../../store/slices/shoppingListSlice';
import {
  setItemEditData,
  clearItemEditData,
} from '../../store/slices/formSlice';
import type { ShoppingItem, ShoppingItemUpdate } from '../../types';
import Text from '../ui/Text/Text';
import './ShoppingListItem.css';

interface ShoppingListItemProps {
  item: ShoppingItem;
  index: number;
}

const CATEGORIES = [
  { value: '', label: 'Select Category' },
  { value: 'grocery', label: 'Grocery' },
  { value: 'household', label: 'Household' },
  { value: 'electronics', label: 'Electronics' },
  { value: 'clothing', label: 'Clothing' },
  { value: 'other', label: 'Other' }
];

const ShoppingListItem: React.FC<ShoppingListItemProps> = ({ item, index }) => {
  const { editingId } = useAppSelector(state => state.shoppingList);
  const { shoppingListItemEdit } = useAppSelector(state => state.form);
  const dispatch = useAppDispatch();
  const editInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const isEditing = editingId === item.id;
  const editData = shoppingListItemEdit[item.id] || {
    text: item.text,
    quantity: item.quantity,
    notes: item.notes || '',
    category: item.category || '',
    images: item.images || [],
    newImageUrl: '',
  };

  // Focus the edit input when editing starts
  useEffect(() => {
    if (isEditing && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [isEditing]);

  // Reset edit values when editing is cancelled or item changes
  useEffect(() => {
    if (!isEditing) {
      dispatch(clearItemEditData(item.id));
    } else {
      // Initialize form with item data when editing starts
      dispatch(setItemEditData({
        itemId: item.id,
        data: {
          text: item.text,
          quantity: item.quantity,
          notes: item.notes || '',
          category: item.category || '',
          images: item.images || [],
          newImageUrl: '',
        }
      }));
    }
  }, [isEditing, item, dispatch]);

  const handleToggle = () => {
    dispatch(toggleItem(item.id));
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      dispatch(deleteItem(item.id));
    }
  };

  const handleStartEdit = () => {
    dispatch(startEditing(item.id));
  };

  const handleSaveEdit = () => {
    const trimmedText = editData.text.trim();
    if (!trimmedText) return;

    const updates: ShoppingItemUpdate = {
      text: trimmedText,
      quantity: editData.quantity,
      notes: editData.notes.trim() || undefined,
      category: editData.category || undefined,
      images: editData.images.length > 0 ? editData.images : undefined,
    };

    dispatch(updateItem({ id: item.id, updates }));
    dispatch(cancelEditing());
  };

  const handleCancelEdit = () => {
    dispatch(cancelEditing());
  };

  const handleEditDataChange = (field: keyof typeof editData, value: any) => {
    dispatch(setItemEditData({
      itemId: item.id,
      data: { [field]: value }
    }));
  };

  const handleQuantityChange = (change: number) => {
    const newQuantity = Math.max(1, editData.quantity + change);
    handleEditDataChange('quantity', newQuantity);
  };

  const handleAddImage = () => {
    if (editData.newImageUrl.trim()) {
      const updatedImages = [...editData.images, editData.newImageUrl.trim()];
      dispatch(setItemEditData({
        itemId: item.id,
        data: {
          images: updatedImages,
          newImageUrl: ''
        }
      }));
    }
  };

  const handleRemoveImage = (index: number) => {
    const updatedImages = editData.images.filter((_, i) => i !== index);
    dispatch(setItemEditData({
      itemId: item.id,
      data: { images: updatedImages }
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (result) {
          const updatedImages = [...editData.images, result];
          dispatch(setItemEditData({
            itemId: item.id,
            data: { images: updatedImages }
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div 
      className={`shopping-item ${item.completed ? 'shopping-item--completed' : ''} ${isEditing ? 'shopping-item--editing' : ''}`}
      style={{ '--animation-delay': `${index * 0.05}s` } as React.CSSProperties}
    >
      <div className="shopping-item__content">
        <div className="shopping-item__main">
          <label className="shopping-item__checkbox-label">
            <input
              type="checkbox"
              checked={item.completed}
              onChange={handleToggle}
              className="shopping-item__checkbox"
              disabled={isEditing}
            />
            <span className="shopping-item__checkbox-custom" />
          </label>

          {isEditing ? (
            <div className="shopping-item__edit-form">
              {/* Item Name */}
              <input
                ref={editInputRef}
                type="text"
                value={editData.text}
                onChange={(e) => handleEditDataChange('text', e.target.value)}
                onKeyDown={handleKeyPress}
                className="shopping-item__edit-input"
                placeholder="Item name..."
                maxLength={100}
                required
              />

              {/* Quantity */}
              <div className="shopping-item__edit-quantity">
                <label className="shopping-item__edit-label">Quantity:</label>
                <div className="shopping-item__quantity-controls">
                  <button
                    type="button"
                    onClick={() => handleQuantityChange(-1)}
                    className="shopping-item__quantity-button"
                    disabled={editData.quantity <= 1}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={editData.quantity}
                    onChange={(e) => handleEditDataChange('quantity', parseInt(e.target.value) || 1)}
                    className="shopping-item__quantity-input"
                    min="1"
                  />
                  <button
                    type="button"
                    onClick={() => handleQuantityChange(1)}
                    className="shopping-item__quantity-button"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Category */}
              <div className="shopping-item__edit-field">
                <label className="shopping-item__edit-label">Category:</label>
                <select
                  value={editData.category}
                  onChange={(e) => handleEditDataChange('category', e.target.value)}
                  className="shopping-item__edit-select"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Notes */}
              <div className="shopping-item__edit-field">
                <label className="shopping-item__edit-label">Notes:</label>
                <textarea
                  value={editData.notes}
                  onChange={(e) => handleEditDataChange('notes', e.target.value)}
                  className="shopping-item__edit-textarea"
                  placeholder="Add notes..."
                  maxLength={500}
                />
              </div>

              {/* Images */}
              <div className="shopping-item__edit-field">
                <label className="shopping-item__edit-label">Images:</label>
                
                {/* Image Upload */}
                <div className="shopping-item__image-upload">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="shopping-item__file-input"
                    style={{ display: 'none' }}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="shopping-item__upload-button"
                  >
                    📷 Upload Image
                  </button>
                </div>

                {/* URL Input */}
                <div className="shopping-item__url-input">
                  <input
                    type="url"
                    value={editData.newImageUrl}
                    onChange={(e) => handleEditDataChange('newImageUrl', e.target.value)}
                    placeholder="Or enter image URL..."
                    className="shopping-item__edit-input"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddImage())}
                  />
                  <button
                    type="button"
                    onClick={handleAddImage}
                    disabled={!editData.newImageUrl.trim()}
                    className="shopping-item__add-url-button"
                  >
                    Add
                  </button>
                </div>

                {/* Image Preview */}
                {editData.images.length > 0 && (
                  <div className="shopping-item__edit-images">
                    {editData.images.map((url: string, index: number) => (
                      <div key={index} className="shopping-item__edit-image-item">
                        <img
                          src={url}
                          alt={`Item ${index + 1}`}
                          className="shopping-item__edit-image"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="shopping-item__remove-image"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="shopping-item__edit-actions">
                <button
                  onClick={handleSaveEdit}
                  className="shopping-item__edit-button shopping-item__edit-button--save"
                  disabled={!editData.text.trim()}
                >
                  Save Changes
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="shopping-item__edit-button shopping-item__edit-button--cancel"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="shopping-item__text-content" onClick={handleToggle}>
              <div className="shopping-item__details">
                <Text
                  variant="body"
                  weight="medium"
                  color={item.completed ? 'muted' : 'primary'}
                  className="shopping-item__text"
                  truncate
                >
                  {item.text}
                </Text>
                
                {/* Display item details */}
                {item.quantity > 1 && (
                  <Text variant="caption" color="muted" className="shopping-item__quantity">
                    Quantity: {item.quantity}
                  </Text>
                )}
                
                {item.category && (
                  <Text variant="caption" color="muted" className="shopping-item__category">
                    Category: {CATEGORIES.find(cat => cat.value === item.category)?.label || item.category}
                  </Text>
                )}
                
                {item.notes && (
                  <Text variant="caption" color="muted" className="shopping-item__notes">
                    Notes: {item.notes}
                  </Text>
                )}
                
                {item.images && item.images.length > 0 && (
                  <div className="shopping-item__image-preview">
                    {item.images.slice(0, 3).map((url: string, index: number) => (
                      <img 
                        key={index} 
                        src={url} 
                        alt={`Item image ${index + 1}`} 
                        className="shopping-item__image" 
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    ))}
                    {item.images.length > 3 && (
                      <span className="shopping-item__image-count">
                        +{item.images.length - 3} more
                      </span>
                    )}
                  </div>
                )}
                
                <Text variant="caption" color="muted" className="shopping-item__date">
                  {item.updatedAt !== item.createdAt ? 'Updated' : 'Added'} {formatDate(item.updatedAt)}
                </Text>
              </div>
            </div>
          )}
        </div>

        {!isEditing && (
          <div className="shopping-item__actions">
            <button
              onClick={handleStartEdit}
              className="shopping-item__action shopping-item__action--edit"
              title="Edit item"
            >
              ✏️
            </button>
            <button
              onClick={handleDelete}
              className="shopping-item__action shopping-item__action--delete"
              title="Delete item"
            >
              🗑️
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShoppingListItem;

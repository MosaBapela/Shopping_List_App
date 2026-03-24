// Add Shopping Item Form Component
import React, { useState, useRef, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { addItem } from '../../store/slices/shoppingListSlice';
import {
  setAddItemFormField,
  setAddItemFormErrors,
  clearAddItemForm,
  setAddItemFormSubmitting,
} from '../../store/slices/formSlice';
import './AddShoppingItemForm.css';

interface AddShoppingItemFormProps {
  onCancel?: () => void;
  showCancelButton?: boolean;
}

const CATEGORIES = [
  { value: '',            label: 'Select category' },
  { value: 'grocery',     label: 'Grocery' },
  { value: 'household',   label: 'Household' },
  { value: 'electronics', label: 'Electronics' },
  { value: 'clothing',    label: 'Clothing' },
  { value: 'other',       label: 'Other' },
];

const AddShoppingItemForm: React.FC<AddShoppingItemFormProps> = ({ onCancel, showCancelButton = false }) => {
  const [imageUrl, setImageUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dispatch = useAppDispatch();
  const { addItemForm } = useAppSelector(state => state.form);
  const { isSubmitting, errors, ...formData } = addItemForm;

  useEffect(() => () => { dispatch(clearAddItemForm()); }, [dispatch]);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.text.trim()) errs.text = 'Item name is required';
    if (formData.quantity <= 0)  errs.quantity = 'Quantity must be > 0';
    dispatch(setAddItemFormErrors(errs));
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    dispatch(setAddItemFormSubmitting(true));
    try {
      dispatch(addItem({
        id:       uuidv4(),
        text:     formData.text.trim(),
        quantity: formData.quantity,
        notes:    formData.notes.trim(),
        category: formData.category,
        images:   formData.images,
      }));
      dispatch(clearAddItemForm());
      setImageUrl('');
      if (fileInputRef.current) fileInputRef.current.value = '';
      await new Promise(r => setTimeout(r, 200));
    } finally {
      dispatch(setAddItemFormSubmitting(false));
    }
  };

  const set = (field: string, value: string | number) => {
    dispatch(setAddItemFormField({ field, value }));
    if (errors[field]) dispatch(setAddItemFormErrors({ ...errors, [field]: '' }));
  };

  const addUrl = () => {
    if (!imageUrl.trim()) return;
    dispatch(setAddItemFormField({ field: 'images', value: [...formData.images, imageUrl.trim()] }));
    setImageUrl('');
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { dispatch(setAddItemFormErrors({ ...errors, image: 'Please select an image' })); return; }
    if (file.size > 5 * 1024 * 1024)    { dispatch(setAddItemFormErrors({ ...errors, image: 'Max 5 MB' })); return; }
    const reader = new FileReader();
    reader.onload = ev => {
      const result = ev.target?.result as string;
      if (result) dispatch(setAddItemFormField({ field: 'images', value: [...formData.images, result] }));
    };
    reader.readAsDataURL(file);
  };

  const removeImage = (i: number) =>
    dispatch(setAddItemFormField({ field: 'images', value: formData.images.filter((_, idx) => idx !== i) }));

  return (
    <div className="add-form">
      <p className="add-form__title">&#10133; Add New Item</p>

      <form onSubmit={handleSubmit}>
        <div className="add-form__grid">
          {/* Name */}
          <div className="add-form__field add-form__grid--full">
            <label className="add-form__label">Item Name<span className="add-form__required">*</span></label>
            <input
              type="text"
              value={formData.text}
              onChange={e => set('text', e.target.value)}
              placeholder="e.g. Organic Bananas"
              className="add-form__input"
              disabled={isSubmitting}
              maxLength={100}
              autoFocus
            />
            {errors.text && <span className="add-form__error-text">{errors.text}</span>}
          </div>

          {/* Quantity */}
          <div className="add-form__field">
            <label className="add-form__label">Quantity</label>
            <div className="add-form__qty-row">
              <button type="button" className="add-form__qty-btn" onClick={() => set('quantity', Math.max(1, formData.quantity - 1))} disabled={formData.quantity <= 1 || isSubmitting}>-</button>
              <input type="number" value={formData.quantity} onChange={e => set('quantity', parseInt(e.target.value) || 1)} min="1" className="add-form__qty-input" disabled={isSubmitting} />
              <button type="button" className="add-form__qty-btn" onClick={() => set('quantity', formData.quantity + 1)} disabled={isSubmitting}>+</button>
            </div>
          </div>

          {/* Category */}
          <div className="add-form__field">
            <label className="add-form__label">Category</label>
            <select value={formData.category} onChange={e => set('category', e.target.value)} className="add-form__select" disabled={isSubmitting}>
              {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>

          {/* Notes */}
          <div className="add-form__field add-form__grid--full">
            <label className="add-form__label">Notes</label>
            <textarea value={formData.notes} onChange={e => set('notes', e.target.value)} placeholder="Any extra details..." className="add-form__textarea" disabled={isSubmitting} maxLength={500} />
          </div>

          {/* Images */}
          <div className="add-form__field add-form__grid--full">
            <label className="add-form__label">Images</label>
            <div className="add-form__img-controls">
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFile} style={{ display: 'none' }} disabled={isSubmitting} />
              <button type="button" className="add-form__upload-btn" onClick={() => fileInputRef.current?.click()} disabled={isSubmitting}>
                &#128247; Upload
              </button>
              <div className="add-form__url-row">
                <input type="text" value={imageUrl} onChange={e => setImageUrl(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addUrl())} placeholder="Or paste image URL..." className="add-form__input" disabled={isSubmitting} />
                <button type="button" className="add-form__add-url-btn" onClick={addUrl} disabled={!imageUrl.trim() || isSubmitting}>Add</button>
              </div>
            </div>
            {errors.image && <span className="add-form__error-text">{errors.image}</span>}
            {formData.images.length > 0 && (
              <div className="add-form__img-previews">
                {formData.images.map((url, i) => (
                  <div key={i} className="add-form__img-thumb">
                    <img src={url} alt={`img-${i}`} onError={e => (e.target as HTMLImageElement).style.display = 'none'} />
                    <button type="button" className="add-form__img-remove" onClick={() => removeImage(i)}>x</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="add-form__footer">
          {showCancelButton && (
            <button type="button" className="add-form__cancel-btn" onClick={onCancel} disabled={isSubmitting}>Cancel</button>
          )}
          <button type="submit" className="add-form__submit-btn" disabled={!formData.text.trim() || isSubmitting}>
            {isSubmitting ? 'Adding...' : 'Add Item'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddShoppingItemForm;

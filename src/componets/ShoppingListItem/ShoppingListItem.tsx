// Shopping List Item Component
import React, { useRef, useEffect } from 'react';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { toggleItem, deleteItem, startEditing, cancelEditing, updateItem } from '../../store/slices/shoppingListSlice';
import { setItemEditData, clearItemEditData } from '../../store/slices/formSlice';
import type { ShoppingItem, ShoppingItemUpdate } from '../../types';
import './ShoppingListItem.css';

const CATEGORIES = [
  { value: '',            label: 'Select category' },
  { value: 'grocery',     label: 'Grocery' },
  { value: 'household',   label: 'Household' },
  { value: 'electronics', label: 'Electronics' },
  { value: 'clothing',    label: 'Clothing' },
  { value: 'other',       label: 'Other' },
];

interface Props { item: ShoppingItem; index: number; }

const ShoppingListItem: React.FC<Props> = ({ item, index }) => {
  const { editingId }           = useAppSelector(s => s.shoppingList);
  const { shoppingListItemEdit } = useAppSelector(s => s.form);
  const dispatch     = useAppDispatch();
  const editRef      = useRef<HTMLInputElement>(null);
  const fileRef      = useRef<HTMLInputElement>(null);
  const isEditing    = editingId === item.id;

  const ed = shoppingListItemEdit[item.id] || {
    text: item.text, quantity: item.quantity,
    notes: item.notes || '', category: item.category || '',
    images: item.images || [], newImageUrl: '',
  };

  useEffect(() => { if (isEditing) editRef.current?.focus(); }, [isEditing]);

  useEffect(() => {
    if (!isEditing) {
      dispatch(clearItemEditData(item.id));
    } else {
      dispatch(setItemEditData({
        itemId: item.id,
        data: { text: item.text, quantity: item.quantity, notes: item.notes || '', category: item.category || '', images: item.images || [], newImageUrl: '' },
      }));
    }
  }, [isEditing, item, dispatch]);

  const setEd = (field: string, value: unknown) =>
    dispatch(setItemEditData({ itemId: item.id, data: { [field]: value } }));

  const handleSave = () => {
    if (!ed.text.trim()) return;
    const updates: ShoppingItemUpdate = {
      text:     ed.text.trim(),
      quantity: ed.quantity,
      notes:    ed.notes.trim() || undefined,
      category: ed.category || undefined,
      images:   ed.images.length > 0 ? ed.images : undefined,
    };
    dispatch(updateItem({ id: item.id, updates }));
    dispatch(cancelEditing());
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const r = ev.target?.result as string;
      if (r) setEd('images', [...ed.images, r]);
    };
    reader.readAsDataURL(file);
  };

  const addUrl = () => {
    if (!ed.newImageUrl.trim()) return;
    dispatch(setItemEditData({ itemId: item.id, data: { images: [...ed.images, ed.newImageUrl.trim()], newImageUrl: '' } }));
  };

  const fmt = (ts: number) => new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  const catLabel = CATEGORIES.find(c => c.value === item.category)?.label || item.category;

  return (
    <div
      className={`sl-item ${item.completed ? 'sl-item--completed' : ''} ${isEditing ? 'sl-item--editing' : ''}`}
      style={{ '--animation-delay': `${index * 0.04}s` } as React.CSSProperties}
    >
      {isEditing ? (
        <div className="sl-item__edit">
          <div className="sl-item__edit-grid">
            {/* Name */}
            <div className="sl-item__edit-full">
              <label className="sl-item__edit-label">Item Name</label>
              <input ref={editRef} type="text" value={ed.text} onChange={e => setEd('text', e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleSave(); if (e.key === 'Escape') dispatch(cancelEditing()); }}
                className="sl-item__edit-input" maxLength={100} />
            </div>
            {/* Qty */}
            <div>
              <label className="sl-item__edit-label">Quantity</label>
              <div className="sl-item__edit-qty-row">
                <button type="button" className="sl-item__edit-qty-btn" onClick={() => setEd('quantity', Math.max(1, ed.quantity - 1))} disabled={ed.quantity <= 1}>-</button>
                <input type="number" value={ed.quantity} onChange={e => setEd('quantity', parseInt(e.target.value) || 1)} min="1" className="sl-item__edit-qty-num" />
                <button type="button" className="sl-item__edit-qty-btn" onClick={() => setEd('quantity', ed.quantity + 1)}>+</button>
              </div>
            </div>
            {/* Category */}
            <div>
              <label className="sl-item__edit-label">Category</label>
              <select value={ed.category} onChange={e => setEd('category', e.target.value)} className="sl-item__edit-select">
                {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
            {/* Notes */}
            <div className="sl-item__edit-full">
              <label className="sl-item__edit-label">Notes</label>
              <textarea value={ed.notes} onChange={e => setEd('notes', e.target.value)} className="sl-item__edit-textarea" maxLength={500} />
            </div>
            {/* Images */}
            <div className="sl-item__edit-full">
              <label className="sl-item__edit-label">Images</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                  <input ref={fileRef} type="file" accept="image/*" onChange={handleFileUpload} style={{ display: 'none' }} />
                  <button type="button" className="sl-item__upload-btn" onClick={() => fileRef.current?.click()}>&#128247; Upload</button>
                  <div className="sl-item__edit-url-row">
                    <input type="text" value={ed.newImageUrl} onChange={e => setEd('newImageUrl', e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addUrl())}
                      placeholder="Or paste image URL..." className="sl-item__edit-input" />
                    <button type="button" className="sl-item__edit-add-url-btn" onClick={addUrl} disabled={!ed.newImageUrl.trim()}>Add</button>
                  </div>
                </div>
                {ed.images.length > 0 && (
                  <div className="sl-item__edit-img-row">
                    {ed.images.map((url: string, i: number) => (
                      <div key={i} className="sl-item__edit-thumb">
                        <img src={url} alt="" onError={e => (e.target as HTMLImageElement).style.display = 'none'} />
                        <button type="button" className="sl-item__edit-thumb-del" onClick={() => setEd('images', ed.images.filter((_: string, j: number) => j !== i))}>x</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="sl-item__edit-actions">
            <button type="button" className="sl-item__edit-cancel-btn" onClick={() => dispatch(cancelEditing())}>Cancel</button>
            <button type="button" className="sl-item__edit-save-btn" onClick={handleSave} disabled={!ed.text.trim()}>Save Changes</button>
          </div>
        </div>
      ) : (
        <div className="sl-item__view">
          <label className="sl-item__check-label">
            <input type="checkbox" checked={item.completed} onChange={() => dispatch(toggleItem(item.id))} className="sl-item__checkbox" />
            <span className="sl-item__check-box" />
          </label>

          <div className="sl-item__body" onClick={() => dispatch(toggleItem(item.id))}>
            <p className="sl-item__name">{item.text}</p>
            <div className="sl-item__meta">
              {item.quantity > 1 && <span className="sl-item__badge">x{item.quantity}</span>}
              {item.category && <span className={`sl-item__badge sl-item__badge--${item.category}`}>{catLabel}</span>}
            </div>
            {item.notes && <p className="sl-item__notes">{item.notes}</p>}
            {item.images && item.images.length > 0 && (
              <div className="sl-item__images">
                {item.images.slice(0, 3).map((url: string, i: number) => (
                  <img key={i} src={url} alt="" className="sl-item__image" onError={e => (e.target as HTMLImageElement).style.display = 'none'} />
                ))}
                {item.images.length > 3 && <div className="sl-item__img-more">+{item.images.length - 3}</div>}
              </div>
            )}
            <p className="sl-item__date">{item.updatedAt !== item.createdAt ? 'Updated' : 'Added'} {fmt(item.updatedAt)}</p>
          </div>

          <div className="sl-item__actions">
            <button className="sl-item__action-btn sl-item__action-btn--edit" onClick={() => dispatch(startEditing(item.id))} title="Edit">&#9998;</button>
            <button className="sl-item__action-btn sl-item__action-btn--delete" onClick={() => { if (window.confirm('Delete this item?')) dispatch(deleteItem(item.id)); }} title="Delete">&#128465;</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShoppingListItem;

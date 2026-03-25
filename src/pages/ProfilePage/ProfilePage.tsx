import React, { useEffect, useState } from 'react';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { updateUserProfile, logout } from '../../store/slices/authSlice';
import {
  setProfileFormField,
  setProfileFormEditing,
  setProfileFormFromUser,
  resetProfileForm,
} from '../../store/slices/formSlice';
import Navigation from '../../componets/Navigation/Navigation';
import ConfirmModal from '../../componets/ConfirmModal/ConfirmModal';
import { useToast } from '../../context/ToastContext';
import './ProfilePage.css';

const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);
const EyeOffIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

const ProfilePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user, isLoading, error } = useAppSelector(state => state.auth);
  const { profileForm } = useAppSelector(state => state.form);
  const {
    isEditing, name, surname, email, cellNumber,
    currentPassword, newPassword, confirmNewPassword,
    showCurrentPassword, showNewPassword, showConfirmNewPassword,
  } = profileForm;
  const { showToast } = useToast();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    if (user) {
      dispatch(setProfileFormFromUser({ name: user.name, surname: user.surname, email: user.email, cellNumber: user.cellNumber }));
      dispatch(setProfileFormEditing(false));
    } else {
      dispatch(resetProfileForm());
    }
  }, [user, dispatch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setProfileFormField({ field: e.target.name, value: e.target.value }));
  };

  const toggleField = (field: string) => {
    dispatch(setProfileFormField({ field, value: !profileForm[field as keyof typeof profileForm] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id || !name.trim() || !surname.trim() || !email.trim() || !cellNumber.trim()) return;

    const isChangingPassword = !!(newPassword.trim() || currentPassword.trim() || confirmNewPassword.trim());

    if (isChangingPassword) {
      if (!currentPassword.trim()) {
        showToast('error', 'Current password required', 'Please enter your current password to set a new one.');
        return;
      }
      if (newPassword.trim().length < 6) {
        showToast('error', 'Password too short', 'New password must be at least 6 characters.');
        return;
      }
      if (newPassword.trim() !== confirmNewPassword.trim()) {
        showToast('error', 'Passwords do not match', 'New password and confirmation do not match.');
        return;
      }
    }

    try {
      const updates: Record<string, string> = {
        name: name.trim(),
        surname: surname.trim(),
        email: email.trim(),
        cellNumber: cellNumber.trim(),
      };
      if (isChangingPassword) {
        updates.password = newPassword.trim();
        updates.currentPassword = currentPassword.trim();
      }

      await dispatch(updateUserProfile({ userId: user.id, updates })).unwrap();
      dispatch(setProfileFormEditing(false));
      dispatch(setProfileFormField({ field: 'currentPassword', value: '' }));
      dispatch(setProfileFormField({ field: 'newPassword', value: '' }));
      dispatch(setProfileFormField({ field: 'confirmNewPassword', value: '' }));

      if (isChangingPassword) {
        showToast('success', 'Password updated', 'Your password has been changed. Use it next time you log in.');
      } else {
        showToast('success', 'Profile updated', 'Your details have been saved successfully.');
      }
    } catch (err: any) {
      showToast('error', 'Update failed', err?.message || 'Could not update your profile. Please try again.');
    }
  };

  const handleCancel = () => {
    if (user) {
      dispatch(setProfileFormFromUser({ name: user.name, surname: user.surname, email: user.email, cellNumber: user.cellNumber }));
    } else {
      dispatch(resetProfileForm());
    }
    dispatch(setProfileFormField({ field: 'currentPassword', value: '' }));
    dispatch(setProfileFormField({ field: 'newPassword', value: '' }));
    dispatch(setProfileFormField({ field: 'confirmNewPassword', value: '' }));
    dispatch(setProfileFormEditing(false));
  };

  const handleLogout = () => {
    setShowLogoutConfirm(false);
    dispatch(logout());
    showToast('info', 'Signed out', 'You have been successfully signed out.');
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  if (!user) return null;

  const initials = (user.name.charAt(0) + user.surname.charAt(0)).toUpperCase();
  const isFormValid = !!(name.trim() && surname.trim() && email.trim() && cellNumber.trim());

  return (
    <div className="profile-page">
      <Navigation />
      <div className="profile-page__body">
        <div className="profile-page__heading">
          <h1 className="profile-page__title">Profile Settings</h1>
          <p className="profile-page__sub">Manage your account information</p>
        </div>

        <div className="profile-page__layout">
          <aside className="profile-page__sidebar">
            <div className="profile-page__avatar">
              {user.avatar
                ? <img src={user.avatar} alt={user.name} className="profile-page__avatar-img" />
                : <span className="profile-page__avatar-initials">{initials}</span>
              }
            </div>
            <p className="profile-page__sidebar-name">{user.name} {user.surname}</p>
            <p className="profile-page__sidebar-email">{user.email}</p>
            <p className="profile-page__sidebar-since">Member since {formatDate(user.createdAt)}</p>
            <button className="profile-page__logout-btn" onClick={() => setShowLogoutConfirm(true)}>
              Sign Out
            </button>
          </aside>

          <div className="profile-page__card">
            {error && <div className="profile-page__error">{error}</div>}

            <div className="profile-page__card-header">
              <h2 className="profile-page__card-title">Personal Information</h2>
              {!isEditing && (
                <button className="profile-page__edit-btn" onClick={() => dispatch(setProfileFormEditing(true))}>
                  Edit Profile
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="profile-page__form">
              <div className="profile-page__grid">
                <div className="profile-page__field">
                  <label className="profile-page__label" htmlFor="pf-name">First Name</label>
                  <input id="pf-name" name="name" type="text" value={name}
                    className={`profile-page__input${!isEditing ? ' profile-page__input--readonly' : ''}`}
                    onChange={handleChange} disabled={!isEditing || isLoading} required />
                </div>

                <div className="profile-page__field">
                  <label className="profile-page__label" htmlFor="pf-surname">Surname</label>
                  <input id="pf-surname" name="surname" type="text" value={surname}
                    className={`profile-page__input${!isEditing ? ' profile-page__input--readonly' : ''}`}
                    onChange={handleChange} disabled={!isEditing || isLoading} required />
                </div>

                <div className="profile-page__field profile-page__field--full">
                  <label className="profile-page__label" htmlFor="pf-email">Email Address</label>
                  <input id="pf-email" name="email" type="email" value={email}
                    className={`profile-page__input${!isEditing ? ' profile-page__input--readonly' : ''}`}
                    onChange={handleChange} disabled={!isEditing || isLoading} required />
                </div>

                <div className="profile-page__field profile-page__field--full">
                  <label className="profile-page__label" htmlFor="pf-cell">Cell Number</label>
                  <input id="pf-cell" name="cellNumber" type="tel" value={cellNumber}
                    className={`profile-page__input${!isEditing ? ' profile-page__input--readonly' : ''}`}
                    onChange={handleChange} disabled={!isEditing || isLoading} required />
                </div>
              </div>

              {isEditing && (
                <>
                  <div className="profile-page__divider"><span>Change Password (optional)</span></div>
                  <div className="profile-page__grid">
                    <div className="profile-page__field profile-page__field--full">
                      <label className="profile-page__label" htmlFor="pf-cur">Current Password</label>
                      <div className="profile-page__pw-wrap">
                        <input id="pf-cur" name="currentPassword" type={showCurrentPassword ? 'text' : 'password'}
                          value={currentPassword}
                          className="profile-page__input"
                          onChange={handleChange}
                          disabled={isLoading}
                          placeholder="Enter your current password" />
                        <button type="button" className="profile-page__pw-toggle"
                          onClick={() => toggleField('showCurrentPassword')}
                          aria-label={showCurrentPassword ? 'Hide password' : 'Show password'}>
                          {showCurrentPassword ? <EyeOffIcon /> : <EyeIcon />}
                        </button>
                      </div>
                    </div>

                    <div className="profile-page__field">
                      <label className="profile-page__label" htmlFor="pf-new">New Password</label>
                      <div className="profile-page__pw-wrap">
                        <input id="pf-new" name="newPassword" type={showNewPassword ? 'text' : 'password'}
                          value={newPassword}
                          className="profile-page__input"
                          onChange={handleChange}
                          disabled={isLoading}
                          placeholder="New password (min 6 chars)" />
                        <button type="button" className="profile-page__pw-toggle"
                          onClick={() => toggleField('showNewPassword')}
                          aria-label={showNewPassword ? 'Hide password' : 'Show password'}>
                          {showNewPassword ? <EyeOffIcon /> : <EyeIcon />}
                        </button>
                      </div>
                    </div>

                    <div className="profile-page__field">
                      <label className="profile-page__label" htmlFor="pf-conf">Confirm New Password</label>
                      <div className="profile-page__pw-wrap">
                        <input id="pf-conf" name="confirmNewPassword" type={showConfirmNewPassword ? 'text' : 'password'}
                          value={confirmNewPassword}
                          className="profile-page__input"
                          onChange={handleChange}
                          disabled={isLoading}
                          placeholder="Confirm new password" />
                        <button type="button" className="profile-page__pw-toggle"
                          onClick={() => toggleField('showConfirmNewPassword')}
                          aria-label={showConfirmNewPassword ? 'Hide password' : 'Show password'}>
                          {showConfirmNewPassword ? <EyeOffIcon /> : <EyeIcon />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="profile-page__form-actions">
                    <button type="submit" className="profile-page__save-btn"
                      disabled={isLoading || !isFormValid}>
                      {isLoading ? <span className="profile-page__spinner" /> : 'Save Changes'}
                    </button>
                    <button type="button" className="profile-page__cancel-btn"
                      onClick={handleCancel} disabled={isLoading}>
                      Cancel
                    </button>
                  </div>
                </>
              )}
            </form>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={showLogoutConfirm}
        title="Sign Out"
        message="Are you sure you want to sign out of your account?"
        confirmLabel="Sign Out"
        cancelLabel="Stay"
        variant="danger"
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutConfirm(false)}
      />
    </div>
  );
};

export default ProfilePage;

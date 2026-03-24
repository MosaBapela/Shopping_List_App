import React, { useEffect } from 'react';
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
import './ProfilePage.css';

const ProfilePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user, isLoading, error } = useAppSelector(state => state.auth);
  const { profileForm } = useAppSelector(state => state.form);
  const { isEditing, name, surname, email, cellNumber } = profileForm;

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id || !name.trim() || !surname.trim() || !email.trim() || !cellNumber.trim()) return;
    try {
      await dispatch(updateUserProfile({
        userId: user.id,
        updates: { name: name.trim(), surname: surname.trim(), email: email.trim(), cellNumber: cellNumber.trim() },
      })).unwrap();
      dispatch(setProfileFormEditing(false));
    } catch (_) {}
  };

  const handleCancel = () => {
    if (user) {
      dispatch(setProfileFormFromUser({ name: user.name, surname: user.surname, email: user.email, cellNumber: user.cellNumber }));
    } else {
      dispatch(resetProfileForm());
    }
    dispatch(setProfileFormEditing(false));
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
            <button className="profile-page__logout-btn" onClick={() => dispatch(logout())}>
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
                      <input id="pf-cur" name="currentPassword" type="password"
                        className="profile-page__input" disabled={isLoading} placeholder="Enter current password" />
                    </div>
                    <div className="profile-page__field">
                      <label className="profile-page__label" htmlFor="pf-new">New Password</label>
                      <input id="pf-new" name="newPassword" type="password"
                        className="profile-page__input" disabled={isLoading} placeholder="New password" />
                    </div>
                    <div className="profile-page__field">
                      <label className="profile-page__label" htmlFor="pf-conf">Confirm New Password</label>
                      <input id="pf-conf" name="confirmNewPassword" type="password"
                        className="profile-page__input" disabled={isLoading} placeholder="Confirm new password" />
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
    </div>
  );
};

export default ProfilePage;

// Profile Page Component
import React, { useEffect } from 'react';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { updateUserProfile, logout } from '../../store/slices/authSlice';
import { 
  setProfileFormField, 
  setProfileFormEditing, 
  resetProfileForm 
} from '../../store/slices/formSlice';
import './ProfilePage.css';
import Navigation from '../../componets/Navigation/Navigation';
import ContentContainer from '../../componets/ui/ContentContainer/ContentContainer';
import Text from '../../componets/ui/Text/Text';

const ProfilePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user, isLoading, error } = useAppSelector(state => state.auth);
  const { profileForm } = useAppSelector(state => state.form);
  
  const isEditing = profileForm.isEditing;
  const formData = {
    name: profileForm.name,
    surname: profileForm.surname,
    email: profileForm.email,
    cellNumber: profileForm.cellNumber,
  };

  useEffect(() => {
    // Reset form when user data changes
    if (user) {
      dispatch(resetProfileForm());
    }
  }, [user, dispatch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    dispatch(setProfileFormField({ field: name, value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.id || !formData.name.trim() || !formData.surname.trim() || !formData.email.trim() || !formData.cellNumber.trim()) {
      return;
    }

    try {
      await dispatch(updateUserProfile({
        userId: user.id,
        updates: {
          name: formData.name.trim(),
          surname: formData.surname.trim(),
          email: formData.email.trim(),
          cellNumber: formData.cellNumber.trim(),
        },
      })).unwrap();
      
      dispatch(setProfileFormEditing(false));
    } catch (error) {
      // Error is handled by Redux
    }
  };

  const handleCancel = () => {
    dispatch(resetProfileForm());
    dispatch(setProfileFormEditing(false));
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (!user) {
    return null;
  }

  return (
    <div className="profile-page">
      <Navigation />
      
      <div className="profile-page__container">
        <ContentContainer variant="default" maxWidth="medium" padding="none">
          <div className="profile-page__header">
            <Text variant="h1" weight="bold" color="primary" align="center">
              Profile Settings
            </Text>
            <Text variant="body" color="muted" align="center">
              Manage your account information
            </Text>
          </div>

          <ContentContainer variant="card" padding="large" className="profile-page__card">
            {/* Profile Avatar */}
            <div className="profile-page__avatar-section">
              <div className="profile-page__avatar">
                {user.avatar ? (
                  <img 
                    src={user.avatar} 
                    alt={user.name}
                    className="profile-page__avatar-image"
                  />
                ) : (
                  <div className="profile-page__avatar-placeholder">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="profile-page__avatar-info">
                <Text variant="h3" weight="semibold" color="primary">
                  {user.name}
                </Text>
                <Text variant="small" color="muted">
                  Member since {formatDate(user.createdAt)}
                </Text>
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="profile-page__error">
                <Text variant="small" color="error" align="center">
                  {error}
                </Text>
              </div>
            )}

            {/* Profile Form */}
            <form onSubmit={handleSubmit} className="profile-page__form">
              <div className="profile-page__field">
                <label htmlFor="name" className="profile-page__label">
                  <Text variant="small" weight="medium" color="secondary">
                    Full Name
                  </Text>
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  className="profile-page__input"
                  disabled={!isEditing || isLoading}
                  required
                />
              </div>

              <div className="profile-page__field">
                <label htmlFor="surname" className="profile-page__label">
                  <Text variant="small" weight="medium" color="secondary">
                    Surname
                  </Text>
                </label>
                <input
                  id="surname"
                  name="surname"
                  type="text"
                  value={formData.surname}
                  onChange={handleChange}
                  className="profile-page__input"
                  disabled={!isEditing || isLoading}
                  required
                />
              </div>

              <div className="profile-page__field">
                <label htmlFor="email" className="profile-page__label">
                  <Text variant="small" weight="medium" color="secondary">
                    Email Address
                  </Text>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="profile-page__input"
                  disabled={!isEditing || isLoading}
                  required
                />
              </div>

              <div className="profile-page__field">
                <label htmlFor="cellNumber" className="profile-page__label">
                  <Text variant="small" weight="medium" color="secondary">
                    Cell Number
                  </Text>
                </label>
                <input
                  id="cellNumber"
                  name="cellNumber"
                  type="tel"
                  value={formData.cellNumber}
                  onChange={handleChange}
                  className="profile-page__input"
                  disabled={!isEditing || isLoading}
                  required
                />
              </div>

              {/* Password Update Section */}
              {isEditing && (
                <div className="profile-page__password-section">
                  <Text variant="h4" weight="semibold" color="primary">
                    Change Password
                  </Text>
                  <div className="profile-page__field">
                    <label htmlFor="currentPassword" className="profile-page__label">
                      <Text variant="small" weight="medium" color="secondary">
                        Current Password
                      </Text>
                    </label>
                    <input
                      id="currentPassword"
                      name="currentPassword"
                      type="password"
                      className="profile-page__input"
                      disabled={isLoading}
                      placeholder="Enter current password to change password"
                    />
                  </div>
                  <div className="profile-page__field">
                    <label htmlFor="newPassword" className="profile-page__label">
                      <Text variant="small" weight="medium" color="secondary">
                        New Password
                      </Text>
                    </label>
                    <input
                      id="newPassword"
                      name="newPassword"
                      type="password"
                      className="profile-page__input"
                      disabled={isLoading}
                      placeholder="Enter new password (optional)"
                    />
                  </div>
                  <div className="profile-page__field">
                    <label htmlFor="confirmPassword" className="profile-page__label">
                      <Text variant="small" weight="medium" color="secondary">
                        Confirm New Password
                      </Text>
                    </label>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      className="profile-page__input"
                      disabled={isLoading}
                      placeholder="Confirm new password"
                    />
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="profile-page__actions">
                {isEditing ? (
                  <div className="profile-page__edit-actions">
                    <button
                      type="submit"
                      disabled={isLoading || !formData.name.trim() || !formData.surname.trim() || !formData.email.trim() || !formData.cellNumber.trim()}
                      className="profile-page__save-button"
                    >
                      {isLoading ? (
                        <div className="profile-page__spinner" />
                      ) : (
                        <Text variant="body" weight="medium" color="white">
                          Save Changes
                        </Text>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={handleCancel}
                      disabled={isLoading}
                      className="profile-page__cancel-button"
                    >
                      <Text variant="body" weight="medium" color="secondary">
                        Cancel
                      </Text>
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => dispatch(setProfileFormEditing(true))}
                    className="profile-page__edit-button"
                  >
                    <Text variant="body" weight="medium" color="primary">
                      Edit Profile
                    </Text>
                  </button>
                )}
              </div>
            </form>

            {/* Logout Section */}
            <div className="profile-page__logout-section">
              <button
                onClick={handleLogout}
                className="profile-page__logout-button"
              >
                <Text variant="body" weight="medium" color="error">
                  Sign Out
                </Text>
              </button>
            </div>
          </ContentContainer>
        </ContentContainer>
      </div>
    </div>
  );
};

export default ProfilePage;
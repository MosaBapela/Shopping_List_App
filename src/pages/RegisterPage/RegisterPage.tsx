// Registration Page Component
import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { registerUser, clearError } from '../../store/slices/authSlice';
import {
  setRegisterFormField,
  clearRegisterForm
} from '../../store/slices/formSlice';

import './RegisterPage.css';
import ContentContainer from '../../componets/ui/ContentContainer/ContentContainer';
import Text from '../../componets/ui/Text/Text';

const RegisterPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  
  const { isLoading, error, isAuthenticated } = useAppSelector(state => state.auth);
  const { registerForm } = useAppSelector(state => state.form);
  const { name, surname, email, cellNumber, password, confirmPassword, showPassword, showConfirmPassword } = registerForm;

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    // Clear any previous errors and form data when component mounts
    dispatch(clearError());
    dispatch(clearRegisterForm());
  }, [dispatch]);

  const handleInputChange = (field: string, value: string) => {
    dispatch(setRegisterFormField({ field, value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !surname.trim() || !email.trim() || !cellNumber.trim() || !password.trim()) {
      return;
    }

    if (password !== confirmPassword) {
      return;
    }

    dispatch(registerUser({
      name: name.trim(),
      surname: surname.trim(),
      email: email.trim(),
      cellNumber: cellNumber.trim(),
      password,
    }));
  };

  const isFormValid = () => {
    return (
      name.trim() &&
      surname.trim() &&
      email.trim() &&
      cellNumber.trim() &&
      password.trim() &&
      confirmPassword.trim() &&
      password === confirmPassword &&
      password.length >= 6
    );
  };

  const getPasswordError = () => {
    if (password && password.length < 6) {
      return 'Password must be at least 6 characters';
    }
    
    if (password && confirmPassword && password !== confirmPassword) {
      return 'Passwords do not match';
    }
    
    return null;
  };

  const handleShowPasswordToggle = () => {
    dispatch(setRegisterFormField({ field: 'showPassword', value: !showPassword }));
  };

  const handleShowConfirmPasswordToggle = () => {
    dispatch(setRegisterFormField({ field: 'showConfirmPassword', value: !showConfirmPassword }));
  };

  const passwordError = getPasswordError();

  return (
    <div className="register-page">
      <div className="register-page__container">
        <ContentContainer variant="card" padding="large" maxWidth="small" className="register-page__card">
          <div className="register-page__header">
            <Text variant="h1" weight="bold" color="primary" align="center">
              Create Account
            </Text>
            <Text variant="body" color="muted" align="center">
              Join us to start organizing your shopping lists
            </Text>
          </div>

          {error && (
            <div className="register-page__error">
              <Text variant="small" color="error" align="center">
                {error}
              </Text>
            </div>
          )}

          {passwordError && (
            <div className="register-page__error">
              <Text variant="small" color="error" align="center">
                {passwordError}
              </Text>
            </div>
          )}

          <form onSubmit={handleSubmit} className="register-page__form">
            <div className="register-page__field">
              <label htmlFor="name" className="register-page__label">
                <Text variant="small" weight="medium" color="secondary">
                  First Name
                </Text>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="register-page__input"
                placeholder="Enter your first name"
                required
                disabled={isLoading}
              />
            </div>

            <div className="register-page__field">
              <label htmlFor="surname" className="register-page__label">
                <Text variant="small" weight="medium" color="secondary">
                  Surname
                </Text>
              </label>
              <input
                id="surname"
                name="surname"
                type="text"
                value={surname}
                onChange={(e) => handleInputChange('surname', e.target.value)}
                className="register-page__input"
                placeholder="Enter your surname"
                required
                disabled={isLoading}
              />
            </div>

            <div className="register-page__field">
              <label htmlFor="email" className="register-page__label">
                <Text variant="small" weight="medium" color="secondary">
                  Email Address
                </Text>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="register-page__input"
                placeholder="Enter your email"
                required
                disabled={isLoading}
              />
            </div>

            <div className="register-page__field">
              <label htmlFor="cellNumber" className="register-page__label">
                <Text variant="small" weight="medium" color="secondary">
                  Cell Number
                </Text>
              </label>
              <input
                id="cellNumber"
                name="cellNumber"
                type="tel"
                value={cellNumber}
                onChange={(e) => handleInputChange('cellNumber', e.target.value)}
                className="register-page__input"
                placeholder="Enter your cell number"
                required
                disabled={isLoading}
              />
            </div>

            <div className="register-page__field">
              <label htmlFor="password" className="register-page__label">
                <Text variant="small" weight="medium" color="secondary">
                  Password
                </Text>
              </label>
              <div className="register-page__password-field">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="register-page__input"
                  placeholder="Create a password (min. 6 characters)"
                  required
                  disabled={isLoading}
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={handleShowPasswordToggle}
                  className="register-page__password-toggle"
                  disabled={isLoading}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            <div className="register-page__field">
              <label htmlFor="confirmPassword" className="register-page__label">
                <Text variant="small" weight="medium" color="secondary">
                  Confirm Password
                </Text>
              </label>
              <div className="register-page__password-field">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  className="register-page__input"
                  placeholder="Confirm your password"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={handleShowConfirmPasswordToggle}
                  className="register-page__password-toggle"
                  disabled={isLoading}
                >
                  {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !isFormValid()}
              className="register-page__submit"
            >
              {isLoading ? (
                <div className="register-page__spinner" />
              ) : (
                <Text variant="body" weight="medium" color="white">
                  Create Account
                </Text>
              )}
            </button>
          </form>

          <div className="register-page__footer">
            <Text variant="small" color="muted" align="center">
              Already have an account?{' '}
              <Link to="/login" className="register-page__link">
                Sign in here
              </Link>
            </Text>
          </div>
        </ContentContainer>
      </div>
    </div>
  );
};

export default RegisterPage;
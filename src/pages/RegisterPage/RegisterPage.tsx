import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { registerUser, clearError } from '../../store/slices/authSlice';
import { setRegisterFormField, clearRegisterForm } from '../../store/slices/formSlice';
import { useToast } from '../../context/ToastContext';
import './RegisterPage.css';

const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

const RegisterPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { isLoading, error, isAuthenticated } = useAppSelector(state => state.auth);
  const { registerForm } = useAppSelector(state => state.form);
  const { name, surname, email, cellNumber, password, confirmPassword, showPassword, showConfirmPassword } = registerForm;
  const { showToast } = useToast();
  const hasRegistered = React.useRef(false);

  useEffect(() => {
    if (isAuthenticated && !hasRegistered.current) {
      hasRegistered.current = true;
      showToast('success', 'Account created!', 'Welcome to ShopList. You are now signed in.');
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate, showToast]);

  useEffect(() => {
    dispatch(clearError());
    dispatch(clearRegisterForm());
  }, [dispatch]);

  const handleInputChange = (field: string, value: string | boolean) => {
    dispatch(setRegisterFormField({ field, value }));
  };

  const getPasswordError = () => {
    if (password && password.length < 6) return 'Password must be at least 6 characters';
    if (password && confirmPassword && password !== confirmPassword) return 'Passwords do not match';
    return null;
  };

  const isFormValid = () =>
    name.trim() && surname.trim() && email.trim() && cellNumber.trim() &&
    password.length >= 6 && confirmPassword.trim() && password === confirmPassword;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid()) return;
    dispatch(registerUser({ name: name.trim(), surname: surname.trim(), email: email.trim(), cellNumber: cellNumber.trim(), password }));
  };

  const passwordError = getPasswordError();

  return (
    <div className="auth-page">
      <div className="auth-page__blob auth-page__blob--1" />
      <div className="auth-page__blob auth-page__blob--2" />

      <div className="auth-card">
        <div className="auth-card__logo">
          <span className="auth-card__logo-icon">&#128722;</span>
          <h1 className="auth-card__logo-title">ShopList</h1>
          <p className="auth-card__logo-sub">Create your free account</p>
        </div>

        {(error || passwordError) && (
          <div className="auth-card__error">
            {error || passwordError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-form__row">
            <div className="auth-field">
              <label htmlFor="reg-name" className="auth-label">First Name</label>
              <input
                id="reg-name" type="text" className="auth-input"
                placeholder="First name"
                value={name}
                onChange={e => handleInputChange('name', e.target.value)}
                disabled={isLoading} required
              />
            </div>
            <div className="auth-field">
              <label htmlFor="reg-surname" className="auth-label">Surname</label>
              <input
                id="reg-surname" type="text" className="auth-input"
                placeholder="Surname"
                value={surname}
                onChange={e => handleInputChange('surname', e.target.value)}
                disabled={isLoading} required
              />
            </div>
          </div>

          <div className="auth-field">
            <label htmlFor="reg-email" className="auth-label">Email Address</label>
            <input
              id="reg-email" type="email" className="auth-input"
              placeholder="you@example.com"
              value={email}
              onChange={e => handleInputChange('email', e.target.value)}
              disabled={isLoading} required
            />
          </div>

          <div className="auth-field">
            <label htmlFor="reg-cell" className="auth-label">Cell Number</label>
            <input
              id="reg-cell" type="tel" className="auth-input"
              placeholder="+27 000 000 0000"
              value={cellNumber}
              onChange={e => handleInputChange('cellNumber', e.target.value)}
              disabled={isLoading} required
            />
          </div>

          <div className="auth-field">
            <label htmlFor="reg-password" className="auth-label">Password</label>
            <div className="auth-pw-wrap">
              <input
                id="reg-password"
                type={showPassword ? 'text' : 'password'}
                className="auth-input"
                placeholder="Min. 6 characters"
                value={password}
                onChange={e => handleInputChange('password', e.target.value)}
                disabled={isLoading} required minLength={6}
              />
              <button type="button" className="auth-pw-toggle"
                onClick={() => handleInputChange('showPassword', !showPassword)}
                disabled={isLoading}
                aria-label={showPassword ? 'Hide password' : 'Show password'}>
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
          </div>

          <div className="auth-field">
            <label htmlFor="reg-confirm" className="auth-label">Confirm Password</label>
            <div className="auth-pw-wrap">
              <input
                id="reg-confirm"
                type={showConfirmPassword ? 'text' : 'password'}
                className="auth-input"
                placeholder="Repeat password"
                value={confirmPassword}
                onChange={e => handleInputChange('confirmPassword', e.target.value)}
                disabled={isLoading} required
              />
              <button type="button" className="auth-pw-toggle"
                onClick={() => handleInputChange('showConfirmPassword', !showConfirmPassword)}
                disabled={isLoading}
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}>
                {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
          </div>

          <button type="submit" className="auth-submit" disabled={isLoading || !isFormValid()}>
            {isLoading ? <span className="auth-spinner" /> : 'Create Account'}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account?{' '}
          <Link to="/login" className="auth-link">Sign in here</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;

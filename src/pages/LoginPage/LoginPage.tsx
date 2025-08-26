// Login Page Component
import React, { useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { loginUser, clearError } from '../../store/slices/authSlice';
import {
  setLoginFormField,
  clearLoginForm
} from '../../store/slices/formSlice';
import './LoginPage.css';
import ContentContainer from '../../componets/ui/ContentContainer/ContentContainer';
import Text from '../../componets/ui/Text/Text';

const LoginPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  
  const { isLoading, error, isAuthenticated } = useAppSelector(state => state.auth);
  const { loginForm } = useAppSelector(state => state.form);
  const { email, password, showPassword } = loginForm;
  
  const from = location.state?.from?.pathname || '/';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  useEffect(() => {
    // Clear any previous errors when component mounts
    dispatch(clearError());
    dispatch(clearLoginForm());
  }, [dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim() || !password.trim()) {
      return;
    }

    dispatch(loginUser({ email: email.trim(), password }));
  };

  const handleDemoLogin = () => {
    dispatch(setLoginFormField({ field: 'email', value: 'demo@example.com' }));
    dispatch(setLoginFormField({ field: 'password', value: 'password123' }));
    dispatch(loginUser({ email: 'demo@example.com', password: 'password123' }));
  };

  const handleInputChange = (field: string, value: string) => {
    dispatch(setLoginFormField({ field, value }));
  };

  const handleShowPasswordToggle = () => {
    dispatch(setLoginFormField({ field: 'showPassword', value: !showPassword }));
  };

  return (
    <div className="login-page">
      <div className="login-page__container">
        <ContentContainer variant="card" padding="large" maxWidth="small" className="login-page__card">
          <div className="login-page__header">
            <Text variant="h1" weight="bold" color="primary" align="center">
              Welcome Back
            </Text>
            <Text variant="body" color="muted" align="center">
              Sign in to your account to continue
            </Text>
          </div>

          {error && (
            <div className="login-page__error">
              <Text variant="small" color="error" align="center">
                {error}
              </Text>
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-page__form">
            <div className="login-page__field">
              <label htmlFor="email" className="login-page__label">
                <Text variant="small" weight="medium" color="secondary">
                  Email Address
                </Text>
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="login-page__input"
                placeholder="Enter your email"
                required
                disabled={isLoading}
              />
            </div>

            <div className="login-page__field">
              <label htmlFor="password" className="login-page__label">
                <Text variant="small" weight="medium" color="secondary">
                  Password
                </Text>
              </label>
              <div className="login-page__password-field">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                  className="login-page__input"
                  placeholder="Enter your password"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={handleShowPasswordToggle}
                  className="login-page__password-toggle"
                  disabled={isLoading}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !email.trim() || !password.trim()}
              className="login-page__submit"
            >
              {isLoading ? (
                <div className="login-page__spinner" />
              ) : (
                <Text variant="body" weight="medium" color="white">
                  Sign In
                </Text>
              )}
            </button>
          </form>

          {/*<div className="login-page__demo">
            <button
              type="button"
              onClick={handleDemoLogin}
              disabled={isLoading}
              className="login-page__demo-button"
            >
              <Text variant="small" weight="medium" color="primary">
                Try Demo Account
              </Text>
            </button>
          </div>*/}

          <div className="login-page__footer">
            <Text variant="small" color="muted" align="center">
              Don't have an account?{' '}
              <Link to="/register" className="login-page__link">
                Sign up here
              </Link>
            </Text>
          </div>
        </ContentContainer>
      </div>
    </div>
  );
};

export default LoginPage;
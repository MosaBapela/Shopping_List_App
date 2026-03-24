// Login Page
import React, { useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { loginUser, clearError } from '../../store/slices/authSlice';
import { setLoginFormField, clearLoginForm } from '../../store/slices/formSlice';
import './LoginPage.css';

const LoginPage: React.FC = () => {
  const dispatch  = useAppDispatch();
  const navigate  = useNavigate();
  const location  = useLocation();
  const { isLoading, error, isAuthenticated } = useAppSelector(s => s.auth);
  const { loginForm } = useAppSelector(s => s.form);
  const { email, password, showPassword } = loginForm;
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/';

  useEffect(() => { if (isAuthenticated) navigate(from, { replace: true }); }, [isAuthenticated, navigate, from]);
  useEffect(() => { dispatch(clearError()); dispatch(clearLoginForm()); }, [dispatch]);

  const set = (field: string, value: string | boolean) => dispatch(setLoginFormField({ field, value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    dispatch(loginUser({ email: email.trim(), password }));
  };

  const handleDemo = () => {
    set('email', 'demo@example.com');
    set('password', 'password123');
    dispatch(loginUser({ email: 'demo@example.com', password: 'password123' }));
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-card__logo">
          <div className="auth-card__logo-icon">&#128722;</div>
          <p className="auth-card__logo-title">Welcome back</p>
          <p className="auth-card__logo-sub">Sign in to your ShopList account</p>
        </div>

        {error && <div className="auth-card__error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-field">
            <label className="auth-label">Email address</label>
            <input type="email" value={email} onChange={e => set('email', e.target.value)} placeholder="you@example.com" className="auth-input" required disabled={isLoading} />
          </div>
          <div className="auth-field">
            <label className="auth-label">Password</label>
            <div className="auth-pw-wrap">
              <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => set('password', e.target.value)} placeholder="Your password" className="auth-input" required disabled={isLoading} />
              <button type="button" className="auth-pw-toggle" onClick={() => set('showPassword', !showPassword)} disabled={isLoading}>
                {showPassword ? '&#128065;' : '&#128064;'}
              </button>
            </div>
          </div>
          <button type="submit" className="auth-submit" disabled={isLoading || !email.trim() || !password.trim()}>
            {isLoading ? <span className="auth-spinner" /> : 'Sign In'}
          </button>
        </form>

        <div className="auth-divider" style={{ marginTop: '16px' }}>or</div>
        <button type="button" className="auth-demo-btn" onClick={handleDemo} disabled={isLoading} style={{ marginTop: '10px' }}>
          &#127918; Try demo account
        </button>

        <p className="auth-footer">
          No account?{' '}
          <Link to="/register" className="auth-link">Create one free</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;

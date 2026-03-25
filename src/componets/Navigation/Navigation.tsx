import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../hooks/useAppSelector';
import './Navigation.css';

const Navigation: React.FC = () => {
  const location = useLocation();
  const { user } = useAppSelector(state => state.auth);

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="nav">
      <div className="nav__inner">
        <Link to="/" className="nav__brand">
          <div className="nav__brand-icon">🛒</div>
          <span className="nav__brand-text">ShopList</span>
        </Link>

        <div className="nav__links">
          <Link to="/" className={`nav__link ${isActive('/') ? 'nav__link--active' : ''}`}>
            <span>🏠</span>
            <span>Home</span>
          </Link>
          <Link to="/profile" className={`nav__link ${isActive('/profile') ? 'nav__link--active' : ''}`}>
            <span>⚙️</span>
            <span>Profile</span>
          </Link>
        </div>

        {user && (
          <Link to="/profile" className="nav__user-chip">
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} className="nav__avatar" />
            ) : (
              <div className="nav__user-initials">
                {user.name.charAt(0).toUpperCase()}{user.surname?.charAt(0).toUpperCase() || ''}
              </div>
            )}
            <span className="nav__user-name">{user.name}</span>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navigation;

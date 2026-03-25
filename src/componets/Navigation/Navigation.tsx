import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../hooks/useAppSelector';
import './Navigation.css';

const IconHome = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const IconProfile = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const IconCart = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
);

const Navigation: React.FC = () => {
  const location = useLocation();
  const { user } = useAppSelector(state => state.auth);

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="nav">
      <div className="nav__inner">
        <Link to="/" className="nav__brand">
          <div className="nav__brand-icon"><IconCart /></div>
          <span className="nav__brand-text">ShopList</span>
        </Link>

        <div className="nav__links">
          <Link to="/" className={`nav__link ${isActive('/') ? 'nav__link--active' : ''}`}>
            <span className="nav__link-icon"><IconHome /></span>
            <span className="nav__link-label">Home</span>
          </Link>
          <Link to="/profile" className={`nav__link ${isActive('/profile') ? 'nav__link--active' : ''}`}>
            <span className="nav__link-icon"><IconProfile /></span>
            <span className="nav__link-label">Profile</span>
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

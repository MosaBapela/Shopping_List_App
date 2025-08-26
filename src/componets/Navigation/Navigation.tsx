// Navigation Component
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../hooks/useAppSelector';
import Text from '../ui/Text/Text';
import './Navigation.css';

const Navigation: React.FC = () => {
  const location = useLocation();
  const { user } = useAppSelector(state => state.auth);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="navigation">
      <div className="navigation__container">
        <div className="navigation__brand">
          <Link to="/" className="navigation__brand-link">
            <Text variant="h4" weight="bold" color="white">
              📝 ShopList
            </Text>
          </Link>
        </div>

        <div className="navigation__menu">
          <Link 
            to="/" 
            className={`navigation__link ${isActive('/') ? 'navigation__link--active' : ''}`}
          >
            <Text variant="body" weight="medium" color="white">
              Home
            </Text>
          </Link>
          
          <Link 
            to="/profile" 
            className={`navigation__link ${isActive('/profile') ? 'navigation__link--active' : ''}`}
          >
            <div className="navigation__profile-link">
              {user?.avatar && (
                <img 
                  src={user.avatar} 
                  alt={user.name}
                  className="navigation__avatar"
                />
              )}
              <Text variant="body" weight="medium" color="white">
                Profile
              </Text>
            </div>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
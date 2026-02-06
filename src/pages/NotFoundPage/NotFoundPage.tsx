// 404 Not Found Page Component
import React from 'react';
import { Link } from 'react-router-dom';
import ContentContainer from '../../componets/ui/ContentContainer/ContentContainer';
import Text from '../../componets/ui/Text/Text';
import './NotFoundPage.css';

const NotFoundPage: React.FC = () => {
  return (
    <div className="not-found-page">
      <div className="not-found-page__container">
        <ContentContainer variant="card" padding="large" maxWidth="medium" className="not-found-page__card">
          <div className="not-found-page__icon">🧭</div>
          <Text variant="h2" weight="bold" color="primary" align="center" className="not-found-page__title">
            Page Not Found
          </Text>
          <Text variant="body" color="muted" align="center" className="not-found-page__subtitle">
            The page you're looking for doesn't exist or may have moved.
          </Text>
          <div className="not-found-page__actions">
            <Link to="/" className="not-found-page__home-link">
              <button className="not-found-page__home-button">
                <Text variant="body" weight="medium" color="white">Go back to Home</Text>
              </button>
            </Link>
          </div>
        </ContentContainer>
      </div>
    </div>
  );
};

export default NotFoundPage;

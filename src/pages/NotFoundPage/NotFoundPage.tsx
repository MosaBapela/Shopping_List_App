import React from 'react';
import { Link } from 'react-router-dom';
import './NotFoundPage.css';

const NotFoundPage: React.FC = () => {
  return (
    <div className="not-found">
      <div className="not-found__card">
        <div className="not-found__code">404</div>
        <div className="not-found__icon">&#127749;</div>
        <h1 className="not-found__title">Page Not Found</h1>
        <p className="not-found__sub">
          The page you&apos;re looking for doesn&apos;t exist or may have moved.
        </p>
        <Link to="/" className="not-found__btn">
          &#8592; Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;

// Reusable Content Container Component
// This replaces the need for multiple divs and provides consistent spacing
// It's a flexible container that can be used throughout the app

import React from 'react';
import './ContentContainer.css';

interface ContentContainerProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'card' | 'section' | 'header';
  padding?: 'none' | 'small' | 'medium' | 'large';
  maxWidth?: 'small' | 'medium' | 'large' | 'full';
}

const ContentContainer: React.FC<ContentContainerProps> = ({
  children,
  className = '',
  variant = 'default',
  padding = 'medium',
  maxWidth = 'medium',
}) => {
  const containerClasses = [
    'content-container',
    `content-container--${variant}`,
    `content-container--padding-${padding}`,
    `content-container--max-width-${maxWidth}`,
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={containerClasses}>
      {children}
    </div>
  );
};

export default ContentContainer;
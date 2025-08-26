// Reusable Text Component
// This provides consistent typography throughout the app
// It handles different text variants, sizes, and colors


import type { JSX } from 'react';
import './Text.css';

interface TextProps {
  children: React.ReactNode;
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'small' | 'caption';
  weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold';
  color?: 'primary' | 'secondary' | 'muted' | 'success' | 'warning' | 'error' | 'white';
  align?: 'left' | 'center' | 'right';
  className?: string;
  truncate?: boolean;
  as?: keyof JSX.IntrinsicElements;
}

const Text: React.FC<TextProps> = ({
  children,
  variant = 'body',
  weight = 'normal',
  color = 'primary',
  align = 'left',
  className = '',
  truncate = false,
  as,
}) => {
  // Determine the HTML element to use
  const getElementType = (): keyof JSX.IntrinsicElements => {
    if (as) return as;
    
    switch (variant) {
      case 'h1': return 'h1';
      case 'h2': return 'h2';
      case 'h3': return 'h3';
      case 'h4': return 'h4';
      case 'caption': return 'span';
      default: return 'p';
    }
  };

  const Element = getElementType();

  const textClasses = [
    'text',
    `text--${variant}`,
    `text--weight-${weight}`,
    `text--color-${color}`,
    `text--align-${align}`,
    truncate && 'text--truncate',
    className,
  ].filter(Boolean).join(' ');

  return (
    <Element className={textClasses}>
      {children}
    </Element>
  );
};

export default Text;
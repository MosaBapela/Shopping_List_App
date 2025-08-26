// Shopping List Header Component
// Displays the main title and summary statistics
// Uses our reusable components for consistent styling

import React from 'react';
import { useAppSelector } from '../../hooks/useAppSelector';
import ContentContainer from '../ui/ContentContainer/ContentContainer';
import Text from '../ui/Text/Text';
import './ShoppingListHeader.css';

const ShoppingListHeader: React.FC = () => {
  const { items } = useAppSelector(state => state.shoppingList);
  
  // Calculate statistics
  const totalItems = items.length;
  const completedItems = items.filter(item => item.completed).length;
  const pendingItems = totalItems - completedItems;

  return (
    <ContentContainer variant="header" padding="large" className="shopping-header">
      <div className="shopping-header__content">
        <Text variant="h1" weight="bold" color="white" align="center">
          Shopping List
        </Text>
        
        <Text variant="body" color="white" align="center" className="shopping-header__subtitle">
          Organize your shopping with ease
        </Text>

        <div className="shopping-header__stats">
          <div className="shopping-header__stat">
            <Text variant="h3" weight="bold" color="white">
              {totalItems}
            </Text>
            <Text variant="small" color="white">
              Total Items
            </Text>
          </div>
          
          <div className="shopping-header__stat">
            <Text variant="h3" weight="bold" color="white">
              {pendingItems}
            </Text>
            <Text variant="small" color="white">
              Pending
            </Text>
          </div>
          
          <div className="shopping-header__stat">
            <Text variant="h3" weight="bold" color="white">
              {completedItems}
            </Text>
            <Text variant="small" color="white">
              Completed
            </Text>
          </div>
        </div>
      </div>
    </ContentContainer>
  );
};

export default ShoppingListHeader;
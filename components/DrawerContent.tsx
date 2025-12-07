import React from 'react';
import { DrawerContentComponentProps } from '@react-navigation/drawer';
import MenuPage from '../pages/MenuPage';

const DrawerContent: React.FC<DrawerContentComponentProps> = React.memo((props) => {
  return <MenuPage {...props} />;
});

export default DrawerContent;
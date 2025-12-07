import React, { createContext, useContext } from 'react';

interface NavigationContextType {
  onAuthSuccess: () => void;
}

const NavigationContext = createContext<NavigationContextType | null>(null);

export const NavigationProvider = ({ 
  children, 
  onAuthSuccess 
}: { 
  children: React.ReactNode;
  onAuthSuccess: () => void;
}) => {
  return (
    <NavigationContext.Provider value={{ onAuthSuccess }}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigationContext = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigationContext must be used within NavigationProvider');
  }
  return context;
};
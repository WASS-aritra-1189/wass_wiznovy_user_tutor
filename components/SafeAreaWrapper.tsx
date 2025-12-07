import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface SafeAreaWrapperProps {
  children: React.ReactNode;
  showBottomOverlay?: boolean;
}

const SafeAreaWrapper: React.FC<SafeAreaWrapperProps> = ({ children, showBottomOverlay = true }) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      {children}
      {showBottomOverlay && insets.bottom > 0 && (
        <View style={[styles.bottomOverlay, { height: insets.bottom }]} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  bottomOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(113, 113, 113, 0.8)',
    zIndex: 1000,
  },
});

export default SafeAreaWrapper;
// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import 'react-native-reanimated';
import AppNavigator from './navigation/AppNavigator';
import { store, persistor } from './store/store';
import SplashScreen from './pages/SplashScreen';
// Create a loading component
const LoadingComponent = () => (
  <SafeAreaProvider>
    <SplashScreen />
    <StatusBar style="auto" />
  </SafeAreaProvider>
);

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={<LoadingComponent />} persistor={persistor}>
        <SafeAreaProvider>
          <NavigationContainer>
            <AppNavigator />
            <StatusBar style="auto" />
          </NavigationContainer>
        </SafeAreaProvider>
      </PersistGate>
    </Provider>
  );
}
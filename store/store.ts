// store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import userReducer from './userSlice';
import tutorReducer from './tutorSlice';
import subjectReducer from './subjectSlice';
import courseReducer from './courseSlice';
import walkthroughReducer from './walkthroughSlice';
import notificationReducer from './notificationSlice';
import sessionReducer from './sessionSlice';
import unitReducer from './unitSlice';
import faqReducer from './faqSlice';

// Persist configuration
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['user'], // only user state will be persisted
  // Optional: You can add timeout
  timeout: 10000,
};

// Create persisted reducer
const persistedUserReducer = persistReducer(persistConfig, userReducer);

export const store = configureStore({
  reducer: {
    user: persistedUserReducer,
    tutor: tutorReducer,
    subject: subjectReducer,
    course: courseReducer,
    walkthrough: walkthroughReducer,
    notifications: notificationReducer,
    sessions: sessionReducer,
    unit: unitReducer,
    faq: faqReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/auth/authSlice';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import { persistReducer, persistStore, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import conversationSlice from './slices/chat/conversationSlice';

// Separate persist configs for different slices
const authPersistConfig = {
  key: 'auth',
  storage,
  whitelist: ['isAuthenticated', 'currentUser', 'accessToken', 'refreshToken'] // Only persist these fields
};

const chatPersistConfig = {
  key: 'conversation',
  storage,
  whitelist: ['conversations'] // Only persist conversations
};

// Create the store with our reducers
const store = configureStore({
  reducer: {
    auth: persistReducer(authPersistConfig, authSlice),
    conversation: persistReducer(chatPersistConfig, conversationSlice),
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const persistor = persistStore(store);
export default store; 
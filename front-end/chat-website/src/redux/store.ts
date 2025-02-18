import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/auth/authSlice';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import { persistReducer, persistStore, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import conversationSlice from './slices/chat/conversationSlice';


const persistConfig={
  key:'chat',
  storage,
}

const store = configureStore({
  reducer: {
    auth: persistReducer(persistConfig, authSlice),
    conversation: persistReducer(persistConfig, conversationSlice),
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
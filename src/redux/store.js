import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { apiSlice } from './slices/ApisliceMutation';
import authReducer from './slices/AuthSliceMutation';

import storage from 'redux-persist/lib/storage'; // localStorage by default
import { persistReducer, persistStore } from 'redux-persist';
import {
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';

// ✅ Persist configuration
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'], 
};

// ✅ Combine reducers first
const rootReducer = combineReducers({
  [apiSlice.reducerPath]: apiSlice.reducer,
  auth: authReducer,
});

// ✅ Wrap rootReducer with persistReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// ✅ Create store with middleware
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // required for redux-persist to work with non-serializable values
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(apiSlice.middleware),
  devTools: true,
});

export const persistor = persistStore(store);
export default store;

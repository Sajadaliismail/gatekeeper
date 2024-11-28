import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer from "../auth/authSlice";
import storage from "redux-persist/lib/storage";
import { persistStore, persistReducer } from "redux-persist";

// Define the persist configuration
const persistConfig = {
  key: "root",
  storage,
};

const appReducer = combineReducers({
  auth: authReducer,
});
// Create a persisted reducer
const persistedReducer = persistReducer(persistConfig, appReducer);

// Configure the store with the persistedReducer
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  devTools: process.env.REACT_APP_ENV !== "production",
});

// Infer the RootState and AppDispatch types from the store
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

const persistor = persistStore(store);

// persistor.purge();
export { store, persistor };

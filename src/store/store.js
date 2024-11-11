import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "./Slicers/authSlice";
import messageReducer from "./Slicers/messageSlice";
// import userReducer from "./Slicers/userSlice";
import { apiService } from "../services/apiService/userApiService";
import { oauthApiService } from "../services/apiService/oauthApiService";

// Redux Persist configuration for the 'auth' slice only
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"], // Persist only 'auth'
  blacklist: ["auth.isLoading"],
};
// persistor.purge();
// Combine reducers: auth (persisted) and ui (non-persisted)
const rootReducer = combineReducers({
  auth: authReducer, // This will be persisted
  message: messageReducer, //Message reducer
  // user: userReducer, //temporary data
});

// Persist reducer wrapping only for the rootReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure the store with the persisted reducer
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat([apiService.middleware, oauthApiService.middleware]), // Add RTK Query middleware here
});

// Set up the persistor
export const persistor = persistStore(store);

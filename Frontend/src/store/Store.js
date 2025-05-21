import { configureStore } from "@reduxjs/toolkit";
import globalReducer from "./features/globalSlice.js";
import authReducer from "./features/auth/authSlice.js";

export const store = configureStore({
  reducer: {
    global: globalReducer,
    auth: authReducer,
  },
});

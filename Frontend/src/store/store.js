import { configureStore } from "@reduxjs/toolkit";
import globalReducer from "./features/globalSlice/globalSlice";
import authReducer from "./features/auth/authSlice";

const store = configureStore({
  reducer: {
    global: globalReducer,
    auth: authReducer,
  },
});

export { store };

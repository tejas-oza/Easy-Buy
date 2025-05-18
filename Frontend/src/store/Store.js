import { configureStore } from "@reduxjs/toolkit";
import globalReducer from "./features/globalSlice.js";

export const store = configureStore({
  reducer: {
    global: globalReducer,
  },
});

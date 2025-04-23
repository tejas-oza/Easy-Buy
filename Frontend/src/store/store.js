import { configureStore } from "@reduxjs/toolkit";
import globalReducer from "./features/globalSlice/globalSlice";

const store = configureStore({
  reducer: {
    global: globalReducer,
  },
});

export { store };

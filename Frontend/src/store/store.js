import { configureStore } from "@reduxjs/toolkit";
import globalReducer from "./features/globalSlice/globalSlice";
import authReducer from "./features/auth/authSlice";
import { productApi } from "./features/products/productApiSlice";

const store = configureStore({
  reducer: {
    global: globalReducer,
    auth: authReducer,

    [productApi.reducerPath]: productApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(productApi.middleware),
});

export { store };

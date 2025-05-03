import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const productApi = createApi({
  reducerPath: "productApi",

  baseQuery: fetchBaseQuery({
    baseUrl: `http://localhost:4000/api/v1/products`,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: () => `/all-products`,
      transformResponse: (response) => response.data,
    }),
  }),
});

export const { useGetProductsQuery } = productApi;

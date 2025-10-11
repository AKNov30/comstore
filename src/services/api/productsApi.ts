import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getApiConfig } from '../../config/api';
import type { Product } from '../../types/product';

// Create API slice
export const productsApi = createApi({
  reducerPath: 'productsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: getApiConfig().baseUrl,
    prepareHeaders: (headers) => {
      const config = getApiConfig();
      Object.entries(config.headers).forEach(([key, value]) => {
        headers.set(key, value);
      });
      return headers;
    },
  }),
  tagTypes: ['Product'],
  endpoints: (builder) => ({
    // Get all products
    getProducts: builder.query<Product[], void>({
      query: () => '/product',
      transformResponse: (response: Product[]) => response,
      providesTags: ['Product'],
    }),
    
    // Get single product
    getProduct: builder.query<Product, string>({
      query: (id) => `/product/${id}`,
      providesTags: (_, __, id) => [{ type: 'Product', id }],
    }),
    
    // Create product
    createProduct: builder.mutation<Product, Partial<Product>>({
      query: (newProduct) => ({
        url: '/product',
        method: 'POST',
        body: newProduct,
      }),
      invalidatesTags: ['Product'],
    }),
    
    // Update product
    updateProduct: builder.mutation<Product, { id: string; updates: Partial<Product> }>({
      query: ({ id, updates }) => ({
        url: `/product/${id}`,
        method: 'PUT',
        body: updates,
      }),
      invalidatesTags: (_, __, { id }) => [{ type: 'Product', id }],
    }),
    
    // Delete product
    deleteProduct: builder.mutation<void, string>({
      query: (id) => ({
        url: `/product/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_, __, id) => [{ type: 'Product', id }],
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useGetProductsQuery,
  useGetProductQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productsApi;

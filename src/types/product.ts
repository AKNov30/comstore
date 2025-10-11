// Product types based on actual API response
export interface Product {
  id: string;
  product_name: string;
  product_price: string;
  product_image: string;
  product_description: string;
  product_category: string;
  updatedAt: string;
}

export interface ProductResponse {
  data: Product[];
  total: number;
  page: number;
  limit: number;
}

export interface ApiError {
  message: string;
  status: number;
  code?: string;
}

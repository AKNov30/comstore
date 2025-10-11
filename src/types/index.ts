// Global type definitions
export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image?: string;
}

export interface RouteConfig {
  path: string;
  element: React.ComponentType;
  children?: RouteConfig[];
}

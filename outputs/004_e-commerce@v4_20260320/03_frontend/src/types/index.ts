export type ToastKind = "success" | "warning" | "error" | "info";

export interface ProductItem {
  id: string;
  title: string;
  brand: string;
  country: string;
  price: number;
  trust: number;
  tags: string[];
  inStock: boolean;
}

export interface GraphNode {
  id: string;
  label: string;
  kind: "product" | "brand" | "risk";
  links: string[];
}

export interface SearchFilters {
  minPrice: number;
  maxPrice: number;
  country: string;
  trustLevel: number;
}

export interface CheckoutForm {
  name: string;
  email: string;
  phone: string;
  address: string;
  paymentMethod: "card" | "paypal";
}

export interface ValidationErrors {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
}

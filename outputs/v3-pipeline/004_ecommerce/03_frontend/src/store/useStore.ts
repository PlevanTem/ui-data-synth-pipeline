import { create } from 'zustand';

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  image: string;
  modelUrl?: string;
  relatedIds: string[];
}

interface AppState {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedNode: string | null;
  setSelectedNode: (id: string | null) => void;
  isGraphView: boolean;
  setIsGraphView: (isGraph: boolean) => void;
  products: Product[];
  cart: Product[];
  addToCart: (product: Product) => void;
}

// Mock Data
const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Minimalist Desk Lamp',
    price: 129,
    category: 'Home',
    description: 'Matte finish aluminum alloy, 3000K warm light.',
    image: 'https://images.unsplash.com/photo-1507473888900-52e1ad14592d?q=80&w=2000&auto=format&fit=crop',
    relatedIds: ['2', '3']
  },
  {
    id: '2',
    name: 'Ergonomic Chair',
    price: 499,
    category: 'Furniture',
    description: 'Breathable mesh, lumbar support, adjustable height.',
    image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?q=80&w=1000&auto=format&fit=crop',
    relatedIds: ['1', '4']
  },
  {
    id: '3',
    name: 'Mechanical Keyboard',
    price: 159,
    category: 'Tech',
    description: 'Wireless, tactile switches, aluminum case.',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b91add1?q=80&w=1000&auto=format&fit=crop',
    relatedIds: ['1']
  },
  {
    id: '4',
    name: 'Noise Cancelling Headphones',
    price: 299,
    category: 'Tech',
    description: 'Active noise cancellation, 30-hour battery life.',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop',
    relatedIds: ['2', '3']
  },
  {
    id: '5',
    name: 'Smart Watch',
    price: 349,
    category: 'Wearable',
    description: 'Health tracking, always-on display.',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop',
    relatedIds: ['4']
  }
];

export const useStore = create<AppState>((set) => ({
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),
  selectedNode: null,
  setSelectedNode: (id) => set({ selectedNode: id }),
  isGraphView: false,
  setIsGraphView: (isGraph) => set({ isGraphView: isGraph }),
  products: MOCK_PRODUCTS,
  cart: [],
  addToCart: (product) => set((state) => ({ cart: [...state.cart, product] })),
}));

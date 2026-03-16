import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import { ChevronLeft, ShoppingCart, Heart, Share2 } from 'lucide-react';
import { ProductViewer3D } from '../components/ProductViewer3D';

export const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, addToCart } = useStore();
  
  const product = products.find(p => p.id === id);

  if (!product) return <div>Product not found</div>;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="relative min-h-screen pb-24"
    >
      <button 
        onClick={() => navigate(-1)}
        className="fixed top-24 left-4 z-50 glass-panel p-2 hover:bg-white/10 transition-colors rounded-full"
      >
        <ChevronLeft className="w-6 h-6 text-white" />
      </button>

      {/* Hero 3D Viewer */}
      <div className="h-[60vh] -mx-4 relative bg-gradient-to-b from-transparent to-backgroundDark">
        <ProductViewer3D product={product} />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-backgroundDark to-transparent" />
      </div>

      {/* Content */}
      <div className="px-4 -mt-12 relative z-10 space-y-8">
        <div className="glass-panel p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{product.name}</h1>
              <p className="text-accent text-xl font-medium">${product.price}</p>
            </div>
            <div className="flex gap-2">
              <button className="p-3 glass-panel hover:bg-white/10 rounded-full transition-colors">
                <Heart className="w-5 h-5 text-white/70 hover:text-red-500 transition-colors" />
              </button>
              <button className="p-3 glass-panel hover:bg-white/10 rounded-full transition-colors">
                <Share2 className="w-5 h-5 text-white/70" />
              </button>
            </div>
          </div>
          
          <p className="text-white/70 leading-relaxed mb-6">
            {product.description}
          </p>

          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <label className="text-sm text-white/50 block mb-2">Color</label>
              <div className="flex gap-2">
                {['#3B82F6', '#10B981', '#F59E0B'].map(color => (
                  <button 
                    key={color}
                    className="w-8 h-8 rounded-full border-2 border-white/20 focus:border-white focus:ring-2 ring-offset-2 ring-offset-backgroundDark transition-all"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
            <div className="flex-1">
              <label className="text-sm text-white/50 block mb-2">Quantity</label>
              <div className="flex items-center glass-panel w-fit px-2 py-1">
                <button className="w-8 h-8 text-white/70 hover:text-white">-</button>
                <span className="w-8 text-center text-white">1</span>
                <button className="w-8 h-8 text-white/70 hover:text-white">+</button>
              </div>
            </div>
          </div>

          <button 
            onClick={() => addToCart(product)}
            className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl shadow-glow transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <ShoppingCart className="w-5 h-5" />
            Add to Cart
          </button>
        </div>

        {/* Specifications */}
        <div className="glass-panel p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Specifications</h3>
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <dt className="text-white/50">Material</dt>
            <dd className="text-white text-right">Premium Alloy</dd>
            <dt className="text-white/50">Weight</dt>
            <dd className="text-white text-right">1.2 kg</dd>
            <dt className="text-white/50">Warranty</dt>
            <dd className="text-white text-right">2 Years</dd>
            <dt className="text-white/50">Shipping</dt>
            <dd className="text-white text-right">Free Express</dd>
          </dl>
        </div>
      </div>
    </motion.div>
  );
};

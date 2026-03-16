import React from 'react';
import { motion } from 'framer-motion';
import { Product } from '../store/useStore';
import { clsx } from 'clsx';

interface GlassProductCardProps {
  product: Product;
  onClick: () => void;
  variant?: 'grid' | 'list' | 'hero';
}

export const GlassProductCard: React.FC<GlassProductCardProps> = ({ product, onClick, variant = 'grid' }) => {
  return (
    <motion.div
      layoutId={`card-${product.id}`}
      className={clsx(
        "glass-panel relative overflow-hidden cursor-pointer group",
        variant === 'grid' && "aspect-[3/4]",
        variant === 'list' && "flex h-32 w-full",
        variant === 'hero' && "aspect-video w-full"
      )}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className={clsx(
        "absolute inset-0 z-0 transition-transform duration-700 group-hover:scale-110",
        variant === 'list' ? "w-32 h-full" : "w-full h-full"
      )}>
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-backgroundDark/90 via-backgroundDark/20 to-transparent" />
      </div>

      <div className={clsx(
        "relative z-10 flex flex-col justify-end h-full p-4",
        variant === 'list' && "ml-32 justify-center items-start"
      )}>
        <motion.h3 
          layoutId={`title-${product.id}`}
          className="text-lg font-semibold text-white drop-shadow-md"
        >
          {product.name}
        </motion.h3>
        <p className="text-sm text-textSecondary">{product.category}</p>
        <motion.div 
          layoutId={`price-${product.id}`}
          className="mt-2 text-accent font-medium"
        >
          ${product.price}
        </motion.div>
        
        {/* Hover overlay for grid/hero */}
        {variant !== 'list' && (
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
             <div className="bg-white/20 backdrop-blur-md p-2 rounded-full">
               <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 7-7 7 7"/><path d="M12 19V5"/></svg>
             </div>
          </div>
        )}
      </div>
      
      {/* Glow effect on hover */}
      <div className="absolute inset-0 border-2 border-primary/0 group-hover:border-primary/50 rounded-2xl transition-colors duration-300 pointer-events-none" />
    </motion.div>
  );
};

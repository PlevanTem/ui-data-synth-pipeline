import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom'; // Added useNavigate
import { useStore } from '../store/useStore';
import { GlassProductCard } from '../components/GlassProductCard';
import { KnowledgeGraphCanvas } from '../components/KnowledgeGraphCanvas';
import { ProductViewer3D } from '../components/ProductViewer3D';

export const Home: React.FC = () => {
  const { isGraphView, products, searchQuery, selectedNode } = useStore(); // Removed setSelectedNode
  const navigate = useNavigate(); // Hook

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative"
    >
      <AnimatePresence mode="wait">
        {isGraphView ? (
          <motion.div
            key="graph"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full h-screen fixed inset-0 z-30 pt-24 pb-24 px-4 bg-backgroundDark/90 backdrop-blur-sm"
          >
            <KnowledgeGraphCanvas />
            
            <div className="absolute top-32 left-8 glass-panel p-4 max-w-xs">
              <h2 className="text-xl font-bold text-white mb-2">Exploring "{searchQuery}"</h2>
              <p className="text-sm text-textSecondary">
                Visualizing relationships between products based on semantic similarity.
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="grid"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {/* Hero Section */}
            <div className="col-span-full mb-8">
              <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent mb-4 text-glow">
                Explore the Future.
              </h1>
              <p className="text-xl text-textSecondary max-w-2xl">
                Discover curated items through our immersive liquid interface.
              </p>
            </div>

            {/* Featured Product */}
            <div className="col-span-full lg:col-span-2 glass-panel p-8 relative overflow-hidden group min-h-[400px]">
              <div className="absolute inset-0 z-0">
                 <ProductViewer3D product={products[0]} />
              </div>
              <div className="relative z-10 pointer-events-none">
                <span className="bg-accent/20 text-accent px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2 inline-block backdrop-blur-sm">
                  Featured
                </span>
                <h2 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">{products[0].name}</h2>
                <p className="text-white/80 max-w-md drop-shadow-md">{products[0].description}</p>
                <button 
                  onClick={() => navigate(`/product/${products[0].id}`)} // Navigate
                  className="mt-6 pointer-events-auto bg-white text-backgroundDark px-6 py-3 rounded-full font-semibold hover:bg-white/90 transition-colors shadow-lg hover:shadow-glow"
                >
                  Shop Now
                </button>
              </div>
            </div>

            {/* Product Grid */}
            {products.slice(1).map((product) => (
              <GlassProductCard
                key={product.id}
                product={product}
                onClick={() => navigate(`/product/${product.id}`)} // Navigate
                variant="grid"
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

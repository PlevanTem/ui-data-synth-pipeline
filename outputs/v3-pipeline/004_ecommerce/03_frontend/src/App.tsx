import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useStore } from './store/useStore';
import { Home } from './pages/Home';
import { ProductDetail } from './pages/ProductDetail';
import { Checkout } from './pages/Checkout';
import { FloatingTabBar } from './components/FloatingTabBar';
import { SemanticSearchBar } from './components/SemanticSearchBar';
import { LiquidBackground } from './components/LiquidBackground';

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/checkout" element={<Checkout />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  const { isGraphView } = useStore();

  return (
    <Router>
      <div className="relative min-h-screen overflow-hidden font-sans text-white">
        <LiquidBackground />
        
        <header className="fixed top-0 left-0 right-0 z-40 p-4 flex justify-center pointer-events-none">
          <div className="pointer-events-auto w-full max-w-2xl">
            <SemanticSearchBar />
          </div>
        </header>

        <main className="pt-24 pb-32 px-4 max-w-7xl mx-auto min-h-screen">
          <AnimatedRoutes />
        </main>

        <FloatingTabBar />
      </div>
    </Router>
  );
}

export default App;

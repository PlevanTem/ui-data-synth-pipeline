import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Home, Search, ShoppingBag, User } from 'lucide-react';
import { useStore } from '../store/useStore';
import { clsx } from 'clsx';

export const FloatingTabBar: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  const { cart } = useStore();

  const tabs = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'search', icon: Search, label: 'Search' },
    { id: 'cart', icon: ShoppingBag, label: 'Cart', badge: cart.length },
    { id: 'profile', icon: User, label: 'Profile' },
  ];

  return (
    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-backgroundDark/60 backdrop-blur-xl border border-white/10 rounded-full p-2 flex items-center shadow-glass">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="relative px-6 py-3 rounded-full transition-colors group"
            >
              {isActive && (
                <motion.div
                  layoutId="active-tab-indicator"
                  className="absolute inset-0 bg-white/10 rounded-full"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              
              <div className="relative z-10 flex flex-col items-center justify-center">
                <Icon 
                  className={clsx(
                    "w-6 h-6 transition-colors duration-300",
                    isActive ? "text-primary" : "text-white/50 group-hover:text-white/80"
                  )} 
                />
                {tab.badge ? (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent text-white text-[10px] flex items-center justify-center rounded-full font-bold">
                    {tab.badge}
                  </span>
                ) : null}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

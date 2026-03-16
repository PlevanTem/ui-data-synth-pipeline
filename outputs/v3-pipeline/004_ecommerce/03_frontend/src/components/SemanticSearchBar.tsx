import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';
import { Search, X, Sparkles } from 'lucide-react';
import { clsx } from 'clsx';

export const SemanticSearchBar: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const { setSearchQuery, setIsGraphView } = useStore();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isActive && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isActive]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(inputValue);
    setIsGraphView(true);
    setIsActive(false);
  };

  const clearSearch = () => {
    setInputValue('');
    setSearchQuery('');
    setIsGraphView(false);
  };

  return (
    <>
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-backgroundDark/80 backdrop-blur-md z-40"
            onClick={() => setIsActive(false)}
          />
        )}
      </AnimatePresence>

      <motion.div
        layoutId="search-bar"
        className={clsx(
          "relative z-50 flex items-center transition-all duration-500 glass-panel",
          isActive ? "w-full max-w-2xl mx-auto top-20" : "w-12 h-12 rounded-full cursor-pointer hover:w-64"
        )}
        onClick={() => !isActive && setIsActive(true)}
      >
        <form onSubmit={handleSubmit} className="flex items-center w-full h-full px-4">
          <Search className="text-white/70 w-5 h-5 flex-shrink-0" />
          
          <AnimatePresence mode='wait'>
            {isActive ? (
              <motion.input
                key="input"
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: '100%' }}
                exit={{ opacity: 0, width: 0 }}
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask for something specific..."
                className="bg-transparent border-none outline-none text-white ml-3 w-full h-full placeholder-white/30"
              />
            ) : (
              inputValue && (
                 <span className="ml-3 text-white truncate max-w-[150px]">{inputValue}</span>
              )
            )}
          </AnimatePresence>

          {inputValue && isActive && (
            <button 
              type="button" 
              onClick={(e) => { e.stopPropagation(); clearSearch(); }}
              className="ml-2 text-white/50 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {!isActive && !inputValue && (
            <span className="ml-3 text-white/50 opacity-0 group-hover:opacity-100 transition-opacity">Search...</span>
          )}
        </form>

        {isActive && (
           <motion.div 
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             className="absolute top-full left-0 right-0 mt-4 p-4 glass-panel"
           >
             <div className="flex items-center text-accent text-sm mb-2">
               <Sparkles className="w-4 h-4 mr-2" />
               <span>Try asking:</span>
             </div>
             <div className="flex flex-wrap gap-2">
               {['Minimalist desk setup', 'Ergonomic workspace', 'Gifts for tech lovers'].map(tag => (
                 <button
                   key={tag}
                   className="px-3 py-1 bg-white/5 hover:bg-white/10 rounded-full text-xs text-white/80 transition-colors"
                   onClick={() => setInputValue(tag)}
                 >
                   {tag}
                 </button>
               ))}
             </div>
           </motion.div>
        )}
      </motion.div>
    </>
  );
};

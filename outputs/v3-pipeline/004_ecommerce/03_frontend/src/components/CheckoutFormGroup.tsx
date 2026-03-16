import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, AlertCircle } from 'lucide-react';
import { clsx } from 'clsx';

interface CheckoutFormGroupProps {
  label: string;
  name: string;
  type?: 'text' | 'number' | 'email';
  required?: boolean;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  placeholder?: string;
}

export const CheckoutFormGroup: React.FC<CheckoutFormGroupProps> = ({
  label,
  name,
  type = 'text',
  required,
  value,
  onChange,
  error,
  placeholder
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="relative mb-6">
      <motion.label
        layout
        htmlFor={name}
        className={clsx(
          "absolute left-4 top-4 text-white/50 pointer-events-none transition-all duration-300 origin-[0_0]",
          (isFocused || value) ? "-translate-y-8 scale-75 text-primary" : ""
        )}
      >
        {label} {required && <span className="text-accent">*</span>}
      </motion.label>
      
      <div className="relative">
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={isFocused ? placeholder : ''}
          aria-invalid={!!error}
          aria-describedby={error ? `${name}-error` : undefined}
          className={clsx(
            "w-full glass-input text-lg",
            error ? "border-accent focus:ring-accent/50" : "border-glassBorder focus:ring-primary/50"
          )}
        />
        
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
          <AnimatePresence>
            {value && !error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
              >
                <Check className="text-green-400 w-5 h-5" />
              </motion.div>
            )}
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
              >
                <AlertCircle className="text-accent w-5 h-5" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div
            id={`${name}-error`}
            role="alert"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="text-accent text-sm mt-1 flex items-center"
          >
            <span className="ml-1">{error}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

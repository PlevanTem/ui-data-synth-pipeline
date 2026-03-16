import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { CheckoutFormGroup } from '../components/CheckoutFormGroup';
import { ChevronLeft, CreditCard, ShoppingBag } from 'lucide-react';

export const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { cart } = useStore();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    card: '',
    expiry: '',
    cvc: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock submission
    alert('Order placed successfully!');
    navigate('/');
  };

  const total = cart.reduce((acc, item) => acc + item.price, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-2xl mx-auto pb-24"
    >
      <div className="flex items-center mb-8">
        <button 
          onClick={() => navigate(-1)}
          className="mr-4 glass-panel p-2 hover:bg-white/10 rounded-full transition-colors"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
        <h1 className="text-3xl font-bold text-white">Checkout</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Order Summary */}
        <div className="glass-panel p-6 h-fit order-2 md:order-1">
          <div className="flex items-center gap-2 mb-6 text-accent">
            <ShoppingBag className="w-5 h-5" />
            <h2 className="font-semibold uppercase tracking-wider text-sm">Order Summary</h2>
          </div>
          
          <div className="space-y-4 mb-6">
            {cart.length === 0 ? (
              <p className="text-white/50 text-center py-4">Your cart is empty.</p>
            ) : (
              cart.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center text-sm">
                  <span className="text-white/80">{item.name}</span>
                  <span className="text-white font-medium">${item.price}</span>
                </div>
              ))
            )}
          </div>
          
          <div className="border-t border-white/10 pt-4 flex justify-between items-center text-lg font-bold text-white">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>

        {/* Payment Form */}
        <form onSubmit={handleSubmit} className="glass-panel p-6 order-1 md:order-2">
          <div className="flex items-center gap-2 mb-6 text-primary">
            <CreditCard className="w-5 h-5" />
            <h2 className="font-semibold uppercase tracking-wider text-sm">Payment Details</h2>
          </div>

          <CheckoutFormGroup
            label="Full Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="John Doe"
          />

          <CheckoutFormGroup
            label="Email Address"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="john@example.com"
          />

          <CheckoutFormGroup
            label="Shipping Address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
            placeholder="123 Nebula St"
          />

          <div className="space-y-4">
            <CheckoutFormGroup
              label="Card Number"
              name="card"
              value={formData.card}
              onChange={handleChange}
              required
              placeholder="0000 0000 0000 0000"
            />
            
            <div className="grid grid-cols-2 gap-4">
              <CheckoutFormGroup
                label="Expiry"
                name="expiry"
                value={formData.expiry}
                onChange={handleChange}
                required
                placeholder="MM/YY"
              />
              <CheckoutFormGroup
                label="CVC"
                name="cvc"
                value={formData.cvc}
                onChange={handleChange}
                required
                placeholder="123"
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full mt-6 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-bold py-4 rounded-xl shadow-glow transition-all active:scale-95"
          >
            Pay ${total.toFixed(2)}
          </button>
        </form>
      </div>
    </motion.div>
  );
};

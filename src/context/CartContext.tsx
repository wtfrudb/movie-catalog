import React, { createContext, useState, useContext, useEffect } from 'react';
import type { Movie } from '../types/Movie';

interface CartItem {
  movie: Movie;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (movie: Movie) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, qty: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('cart');
    if (stored) {
      setCart(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (movie: Movie) => {
    setCart(prev => {
      const found = prev.find(item => item.movie.id === movie.id);
      if (found) {
        return prev.map(item =>
          item.movie.id === movie.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { movie, quantity: 1 }];
    });
  };

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(item => item.movie.id !== id));
  };

  const updateQuantity = (id: number, qty: number) => {
    if (qty <= 0) {
      removeFromCart(id);
    } else {
      setCart(prev =>
        prev.map(item =>
          item.movie.id === id ? { ...item, quantity: qty } : item
        )
      );
    }
  };

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};

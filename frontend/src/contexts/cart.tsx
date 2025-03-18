'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Cart } from '@/types';

interface CartContextType {
  cart: Cart;
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const PLATFORM_FEE_PERCENTAGE = 0.10; // 10% de taxa da plataforma

const getInitialCart = (): Cart => {
  if (typeof window !== 'undefined') {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      return JSON.parse(savedCart);
    }
  }
  return {
    items: [],
    total: 0,
    platformFee: 0,
  };
};

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart>(getInitialCart);
  const [isInitialized, setIsInitialized] = useState(false);

  // Garantir que o estado inicial seja carregado apenas uma vez
  useEffect(() => {
    setIsInitialized(true);
  }, []);

  // Salvar no localStorage apenas após a inicialização
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }, [cart, isInitialized]);

  // Calcular total e taxa da plataforma
  const calculateTotals = (items: CartItem[]) => {
    const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const platformFee = subtotal * PLATFORM_FEE_PERCENTAGE;
    const total = subtotal + platformFee;
    return { total, platformFee };
  };

  const addToCart = (newItem: CartItem) => {
    setCart(prevCart => {
      // Verificar se o item já existe no carrinho
      const existingItemIndex = prevCart.items.findIndex(item => item.id === newItem.id);

      let updatedItems;
      if (existingItemIndex >= 0) {
        // Atualizar quantidade se o item já existir
        updatedItems = prevCart.items.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + newItem.quantity }
            : item
        );
      } else {
        // Adicionar novo item
        updatedItems = [...prevCart.items, newItem];
      }

      const { total, platformFee } = calculateTotals(updatedItems);

      return {
        items: updatedItems,
        total,
        platformFee,
      };
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart(prevCart => {
      const updatedItems = prevCart.items.filter(item => item.id !== itemId);
      const { total, platformFee } = calculateTotals(updatedItems);

      return {
        items: updatedItems,
        total,
        platformFee,
      };
    });
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity < 1) return;

    setCart(prevCart => {
      const updatedItems = prevCart.items.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      );
      const { total, platformFee } = calculateTotals(updatedItems);

      return {
        items: updatedItems,
        total,
        platformFee,
      };
    });
  };

  const clearCart = () => {
    setCart({
      items: [],
      total: 0,
      platformFee: 0,
    });
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

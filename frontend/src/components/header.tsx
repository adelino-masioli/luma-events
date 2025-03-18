'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { useCart } from '@/contexts/cart';

export default function Header() {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [cartItemsCount, setCartItemsCount] = useState(0);

  useEffect(() => {
    setCartItemsCount(cart.items.reduce((total, item) => total + item.quantity, 0));
  }, [cart.items]);

  const toggleMobileMenu = () => {
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenu) {
      setIsMobileMenuOpen(!isMobileMenuOpen);
      mobileMenu.style.maxHeight = isMobileMenuOpen ? '0' : `${mobileMenu.scrollHeight}px`;
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60" role="banner">
      <div className="container flex h-16 items-center justify-between px-4 md:px-8">
        <div className="flex gap-6 md:gap-10">
          <a href="/" className="flex items-center space-x-2" aria-label="Luma Events - Página Inicial">
            <span className="font-bold text-xl text-primary">Luma</span>
          </a>
          <nav className="hidden md:flex gap-6" role="navigation" aria-label="Menu Principal">
            <a href="/eventos" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md px-2 py-1">
              Eventos
            </a>
            <a href="/sobre" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md px-2 py-1">
              Sobre
            </a>
            <a href="/contato" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md px-2 py-1">
              Contato
            </a>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex">
            <div className="relative">
              <label htmlFor="search" className="sr-only">Buscar eventos</label>
              <input 
                id="search"
                type="search" 
                placeholder="Buscar eventos..." 
                className="header-search w-[300px] text-sm"
                aria-label="Buscar eventos"
              />
            </div>
          </div>

          {/* Auth Section */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md px-2 py-1"
                aria-expanded={isProfileMenuOpen}
                aria-haspopup="true"
              >
                <span>{user.username}</span>
                <svg
                  className={`h-4 w-4 transition-transform ${isProfileMenuOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isProfileMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="user-menu"
                >
                  <div className="py-1" role="none">
                    <a
                      href="/perfil"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors"
                      role="menuitem"
                    >
                      Minha Conta
                    </a>
                    <a
                      href="/perfil?tab=orders"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors"
                      role="menuitem"
                    >
                      Meus Pedidos
                    </a>
                  </div>
                  <div className="py-1" role="none">
                    <button
                      onClick={logout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 hover:text-red-700 transition-colors"
                      role="menuitem"
                    >
                      Sair
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <a href="/login" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md px-2 py-1">
                Entrar
              </a>
              <a href="/cadastro" className="text-sm font-medium text-white bg-primary hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md px-4 py-2">
                Cadastrar
              </a>
            </div>
          )}

          {/* Shopping Cart */}
          <a href="/carrinho" className="relative group focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md p-1" aria-label="Carrinho de Compras">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-gray-600 group-hover:text-primary transition-colors" aria-hidden="true">
              <circle cx="8" cy="21" r="1"/>
              <circle cx="19" cy="21" r="1"/>
              <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
            </svg>
            {cartItemsCount > 0 && (
              <span 
                className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center" 
                aria-label={`${cartItemsCount} ${cartItemsCount === 1 ? 'item' : 'itens'} no carrinho`}
              >
                {cartItemsCount}
              </span>
            )}
          </a>
          <button 
            onClick={toggleMobileMenu}
            className="md:hidden focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md p-1 group" 
            aria-label="Abrir menu de navegação"
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
            id="mobile-menu-button"
          >
            <div className="w-6 h-5 flex flex-col justify-between group-hover:text-primary transition-colors">
              <span className="w-full h-0.5 bg-gray-600 rounded-full transform transition-all duration-300 group-hover:bg-primary" />
              <span className="w-full h-0.5 bg-gray-600 rounded-full transition-all duration-300 group-hover:bg-primary" />
              <span className="w-full h-0.5 bg-gray-600 rounded-full transform transition-all duration-300 group-hover:bg-primary" />
            </div>
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <div 
        id="mobile-menu"
        className="md:hidden overflow-hidden transition-all duration-300 ease-in-out max-h-0"
        aria-hidden={!isMobileMenuOpen}
      >
        <nav className="container px-4 py-4 space-y-2" role="navigation" aria-label="Menu Mobile">
          <div className="mb-4">
            <div className="relative">
              <label htmlFor="mobile-search" className="sr-only">Buscar eventos</label>
              <input 
                id="mobile-search"
                type="search" 
                placeholder="Buscar eventos..." 
                className="header-search w-full text-sm"
                aria-label="Buscar eventos"
              />
            </div>
          </div>
          <a 
            href="/eventos" 
            className="block px-4 py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-50 hover:text-primary transition-colors"
          >
            Eventos
          </a>
          <a 
            href="/sobre" 
            className="block px-4 py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-50 hover:text-primary transition-colors"
          >
            Sobre
          </a>
          <a 
            href="/contato" 
            className="block px-4 py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-50 hover:text-primary transition-colors"
          >
            Contato
          </a>
        </nav>
      </div>
    </header>
  );
}

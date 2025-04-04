'use client';

import { useState, useMemo, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { useCart } from '@/contexts/cart';
import Link from 'next/link';
import Image from "next/image";
import SearchInput from '@/components/layout/search-input';

export default function Header() {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Verifica se o componente foi montado no cliente
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Calcula o total de itens no carrinho
  const cartItemsCount = useMemo(() => {
    return cart.items.reduce((total, item) => total + item.quantity, 0);
  }, [cart.items]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-primary">
      <div className="container flex h-16 items-center justify-between px-4 md:px-8">
        <div className="flex gap-6 md:gap-10">
        <Link href="/" className="font-bold text-xl text-white relative w-[134px] h-[28px] flex justify-center items-center">
          <Image
            src="/logo-green.png"
            alt="Luma Events"
            width={134}
            height={28}
            style={{ width: "auto", height: "auto" }}
            className="h-[28px] w-auto"
            priority
          />
        </Link>

          <nav className="hidden md:flex gap-6">
            <Link href="/eventos" className="text-sm font-medium text-white hover:text-gray-200 transition-colors focus:outline-none  flex justify-center items-center px-2 py-1">
              Eventos
            </Link>
            <Link href="/sobre" className="text-sm font-medium text-white hover:text-gray-200 transition-colors focus:outline-none   flex justify-center items-center px-2 py-1">
              Sobre
            </Link>
            <Link href="/contato" className="text-sm font-medium text-white hover:text-gray-200 transition-colors focus:outline-none   flex justify-center items-center px-2 py-1">
              Contato
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">

          <div className="hidden md:flex">
            <SearchInput 
              className="relative w-[300px]"
              inputClassName="header-search w-full text-sm"
              iconClassName="h-5 w-5 text-gray-400"
              autoSearch={true}
            />
          </div>

          {/* Carrinho */}
          <Link
            href="/carrinho"
            className="relative p-2 text-white hover:text-gray-200 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            {isMounted && cartItemsCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {cartItemsCount}
              </span>
            )}
          </Link>

          {/* Menu do usuário */}
          {isMounted && user ? (
            <div className="relative">
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="text-sm font-medium text-white hover:text-gray-200 transition-colors focus:outline-none  flex justify-center items-center px-2 py-1"
              >
                {user.username}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-4 w-4 transition-transform ${isProfileMenuOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                  <div className="py-1" role="menu" aria-orientation="vertical">
                    <Link
                      href="/perfil"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      Minha Conta
                    </Link>
                    <Link
                      href="/tickets"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      Meus Ingressos
                    </Link>
                    {user?.groups?.includes('hostess') && (
                      <Link
                        href="/hostess"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        role="menuitem"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        Portal de Check-in
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        logout();
                        setIsProfileMenuOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                    >
                      Sair
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            isMounted && (
              <Link
                href="/login"
                className="text-sm font-medium text-white hover:text-gray-200 transition-colors focus:outline-none  flex justify-center items-center px-2 py-1"
              >
                Entrar
              </Link>
            )
          )}

          {/* Botão do menu mobile */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden text-sm font-medium text-white hover:text-gray-200 transition-colors focus:outline-none  flex justify-center items-center px-2 py-1"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Menu mobile */}
      {isMounted && (
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMobileMenuOpen ? 'max-h-screen' : 'max-h-0'
          }`}
        >
          <nav className="px-4 pt-2 pb-4 space-y-2">
            <Link
              href="/eventos"
              className="block text-sm font-medium text-white hover:text-gray-200 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Eventos
            </Link>
            <Link
              href="/sobre"
              className="block text-sm font-medium text-white hover:text-gray-200 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Sobre
            </Link>
            <Link
              href="/contato"
              className="block text-sm font-medium text-white hover:text-gray-200 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Contato
            </Link>
            {user && (
              <>
                <Link
                  href="/tickets"
                  className="block text-sm font-medium text-white hover:text-gray-200 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Meus Ingressos
                </Link>
                {user.groups?.includes('hostess') && (
                  <Link
                    href="/hostess"
                    className="block text-sm font-medium text-white hover:text-gray-200 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Portal de Check-in
                  </Link>
                )}
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
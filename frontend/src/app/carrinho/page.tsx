'use client';

import { useCart } from '@/contexts/cart';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react'; 
import PaymentForm from '@/components/payment/payment-form';

export default function CartPage() {
    const { cart, removeFromCart, updateQuantity } = useCart();
  // Add this state to handle client-side rendering
  const [isClient, setIsClient] = useState(false);

  // Use this effect to mark when we're on the client
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Show nothing during server rendering
  if (!isClient) {
    return null; // Return null during server rendering
  }

  // Now the rest of your component will only run on the client
  if (cart.items.length === 0) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Seu carrinho está vazio</h2>
          <p className="mt-2 text-gray-600">
            Explore nossos eventos e encontre algo que você goste!
          </p>
          <Link
            href="/eventos"
            className="mt-6 inline-block px-6 py-3 text-white bg-primary rounded-lg hover:bg-primary-dark transition-colors"
          >
            Ver Eventos
          </Link>
        </div>
      </div>
    );
  }


  return (
    <div className="container px-4 md:px-8 py-8">
      <h3 className="text-3xl font-bold text-gray-900 mb-8">Carrinho</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {cart.items.map((item) => (
              <div key={item.id} className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex gap-6">
                  <div className="relative w-24 h-24 flex-shrink-0">
                    <Image
                      src={item.eventThumbnail || 'https://placehold.co/600x400/png'}
                      alt={item.eventTitle}
                      fill
                      priority
                      sizes="(max-width: 768px) 96px, 96px"
                      className="object-cover rounded-lg"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-semibold text-lg text-gray-900">
                          {item.eventTitle}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {new Date(item.eventDate).toLocaleDateString('pt-BR', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                        <p className="text-sm text-gray-600">
                          Ingresso: {item.ticketName}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-lg text-gray-900">
                          {new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL'
                          }).format(item.price * item.quantity)}
                        </p>
                        <p className="text-sm text-gray-600">
                          {new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL'
                          }).format(item.price)} por ingresso
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 rounded-md hover:bg-gray-100"
                        >
                          <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                          </svg>
                        </button>
                        <span className="text-gray-900 w-6 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 rounded-md hover:bg-gray-100"
                        >
                          <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-sm text-red-600 hover:text-red-700"
                      >
                        Remover
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-8">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Resumo do pedido</h2>
              <div className="space-y-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    }).format(cart.total - cart.platformFee)}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Taxa da plataforma (10%)</span>
                  <span>
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    }).format(cart.platformFee)}
                  </span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between font-semibold text-gray-900">
                    <span>Total</span>
                    <span>
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      }).format(cart.total)}
                    </span>
                  </div>
                </div>
              </div>
              <PaymentForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
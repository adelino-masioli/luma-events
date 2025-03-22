'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Elements } from '@stripe/react-stripe-js';
import stripePromise from '@/utils/stripe';
import { createPaymentIntent } from '@/utils/stripe';
import { useCart } from '@/contexts/cart';

export default function PaymentForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { cart, clearCart } = useCart();

  const handlePayment = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Criar o payment intent
      const { clientSecret, payment_id } = await createPaymentIntent(cart.items);

      // Redirecionar para a página de checkout
      router.push(`/checkout/${payment_id}?client_secret=${clientSecret}`);
    } catch (err) {
      setError('Erro ao processar pagamento. Por favor, tente novamente.');
      console.error('Erro no pagamento:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handlePayment}
        disabled={isLoading}
        className={`w-full px-6 py-3 text-white bg-primary rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
          isLoading 
            ? 'opacity-75 cursor-not-allowed'
            : 'hover:bg-primary-dark'
        }`}
      >
        {isLoading ? 'Processando...' : 'Finalizar Compra'}
      </button>
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}

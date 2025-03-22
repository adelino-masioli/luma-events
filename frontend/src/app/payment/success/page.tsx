'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCart } from '@/contexts/cart';
import Link from 'next/link';

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { clearCart } = useCart();
  const [hasProcessed, setHasProcessed] = useState(false);
  const paymentIntent = searchParams.get('payment_intent');
  const paymentIntentClientSecret = searchParams.get('payment_intent_client_secret');

  useEffect(() => {
    if (hasProcessed) return;

    if (paymentIntent && paymentIntentClientSecret) {
      clearCart();
      setHasProcessed(true);
    } else {
      router.push('/');
    }
  }, [paymentIntent, paymentIntentClientSecret, clearCart, router, hasProcessed]);

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
      <div className="text-center">
        <div className="mb-4">
          <svg
            className="mx-auto h-12 w-12 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Pagamento realizado com sucesso!
        </h2>
        <p className="text-gray-600 mb-6">
          Obrigado por sua compra. Você receberá um e-mail com os detalhes do pedido.
        </p>
        <Link
          href="/perfil"
          className="inline-block px-6 py-3 text-white bg-primary rounded-lg hover:bg-primary-dark transition-colors"
        >
          Ver meus ingressos
        </Link>
      </div>
    </div>
  );
}

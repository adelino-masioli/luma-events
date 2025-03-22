'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Elements } from '@stripe/react-stripe-js';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import stripePromise from '@/utils/stripe';
import { toast } from '@/components/ui/use-toast';

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      setIsProcessing(true);
      const { error: submitError } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment/success`,
        },
      });

      if (submitError) {
        setError(submitError.message || 'Ocorreu um erro ao processar o pagamento.');
        toast({
          variant: "destructive",
          title: "Erro no pagamento",
          description: submitError.message || 'Ocorreu um erro ao processar o pagamento.',
        });
      }
    } catch (e) {
      console.error('Erro ao processar pagamento:', e);
      setError('Ocorreu um erro inesperado. Por favor, tente novamente.');
      toast({
        variant: "destructive",
        title: "Erro no pagamento",
        description: 'Ocorreu um erro inesperado. Por favor, tente novamente.',
      });
    } finally {
      setIsLoading(false);
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <PaymentElement />
      </div>
      
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
          {error}
        </div>
      )}
      
      <button
        type="submit"
        disabled={!stripe || isLoading || isProcessing}
        className={`w-full px-6 py-3 text-white bg-primary rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
          (!stripe || isLoading || isProcessing) 
            ? 'opacity-75 cursor-not-allowed'
            : 'hover:bg-primary-dark'
        }`}
      >
        {isProcessing ? 'Processando pagamento...' : isLoading ? 'Carregando...' : 'Pagar agora'}
      </button>
      
      <p className="text-sm text-gray-500 text-center">
        Seu pagamento será processado de forma segura pelo Stripe
      </p>
    </form>
  );
}

export default function CheckoutPage({ params }: { params: { paymentId: string } }) {
  const searchParams = useSearchParams();
  const clientSecret = searchParams.get('client_secret');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient || !clientSecret) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container px-4 py-8">
      <h1 className="text-2xl font-bold text-center mb-8">Finalizar Pagamento</h1>
      <Elements
        stripe={stripePromise}
        options={{
          clientSecret,
          appearance: {
            theme: 'stripe',
            variables: {
              colorPrimary: '#0F172A',
              colorBackground: '#ffffff',
              colorText: '#1e293b',
              colorDanger: '#ef4444',
              fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
              spacingUnit: '4px',
              borderRadius: '8px',
            },
          },
        }}
      >
        <CheckoutForm />
      </Elements>
    </div>
  );
}

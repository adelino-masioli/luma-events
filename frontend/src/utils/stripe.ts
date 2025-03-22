import { loadStripe } from '@stripe/stripe-js';
import { CartItem } from '@/types';

// Carregar a instância do Stripe com a chave pública
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PK!);

export const createPaymentIntent = async (items: CartItem[]) => {
  try {
    // Formatar os itens conforme esperado pelo backend
    const formattedItems = items.map(item => ({
      event_id: item.eventId,
      quantity: item.quantity,
      price: Number(item.price) // Garantir que o preço seja um número
    }));

    console.log('Enviando dados para o backend:', { items: formattedItems });

    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Usuário não autenticado');
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/payments/create-payment-intent/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ items: formattedItems }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Erro ao criar pagamento');
    }

    return data;
  } catch (error) {
    console.error('Erro ao criar payment intent:', error);
    throw error;
  }
};

export const processPayment = async (clientSecret: string) => {
  const stripe = await stripePromise;
  if (!stripe) throw new Error('Stripe não foi inicializado');

  return stripe.confirmPayment({
    elements: stripe.elements({
      clientSecret,
      appearance: {
        theme: 'stripe',
      },
    }),
    confirmParams: {
      return_url: `${window.location.origin}/payment/success`,
    },
  });
};

export default stripePromise;

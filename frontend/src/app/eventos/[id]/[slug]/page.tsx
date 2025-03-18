'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Event } from '@/types';
import { getEvents } from '@/services/api';
import { useCart } from '@/contexts/cart';
import { v4 as uuidv4 } from 'uuid';

export default function EventPage() {
  const { id, slug } = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<number | null>(null);
  const [ticketQuantities, setTicketQuantities] = useState<{ [key: number]: number }>({});
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  useEffect(() => {
    async function loadEvent() {
      try {
        const events = await getEvents();
        const foundEvent = events.find(e => e.id === Number(id) && e.slug === slug);
        
        if (foundEvent) {
          setEvent(foundEvent);
        } else {
          setError('Evento não encontrado');
        }
      } catch (err) {
        setError('Erro ao carregar o evento');
      } finally {
        setLoading(false);
      }
    }

    loadEvent();
  }, [id, slug]);

  const updateTicketQuantity = (ticketId: number, quantity: number) => {
    if (quantity < 1) return;
    setTicketQuantities(prev => ({
      ...prev,
      [ticketId]: quantity
    }));
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-b-2 border-primary animate-spin"></div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Evento não encontrado</h2>
          <p className="mt-2 text-gray-600">
            O evento que você está procurando não existe ou foi removido.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container px-4 md:px-8 py-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="overflow-hidden bg-white rounded-xl shadow-sm">
            <div className="aspect-[2/1] relative">
              <Image
                src={event.thumbnail || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80'}
                alt={event.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 50vw"
                className="object-cover w-full h-full"
                priority
                quality={90}
              />
            </div>
            <div className="p-8">
              <h1 className="text-3xl font-bold text-gray-900">{event.title}</h1>
              <div className="flex items-center mt-6 space-x-2 text-gray-500">
                <div className="flex items-center">
                  <svg className="mr-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {new Date(event.date).toLocaleDateString('pt-BR', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </div>
                <span>•</span>
                <div className="flex items-center">
                  <svg className="mr-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {new Date(event.date).toLocaleTimeString('pt-BR', {
                    hour: 'numeric',
                    minute: '2-digit',
                  })}
                </div>
                <span>•</span>
                <div className="flex items-center">
                  <svg className="mr-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {event.location}
                </div>
              </div>
              <div className="mt-8">
                <h2 className="text-xl font-semibold text-gray-900">Sobre este evento</h2>
                <p className="mt-4 text-gray-600 whitespace-pre-wrap">{event.description}</p>
              </div>
              <div className="mt-8">
                <h2 className="text-xl font-semibold text-gray-900">Organizador</h2>
                <div className="flex items-center mt-4">
                  <div className="flex flex-shrink-0 justify-center items-center w-10 h-10 bg-primary/10 rounded-full">
                    <span className="text-lg font-medium text-primary">
                      {event.organizer[0].toUpperCase()}
                    </span>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      {event.organizer}
                    </h3>
                  </div>
                </div>
              </div>
              <div className="mt-8">
                <h2 className="text-xl font-semibold text-gray-900">Localização</h2>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <h3 className="font-medium text-gray-900">Estado</h3>
                    <p className="mt-1 text-gray-600">{event.state}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Cidade</h3>
                    <p className="mt-1 text-gray-600">{event.city}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Categoria</h3>
                    <p className="mt-1 text-gray-600">{event.category}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="lg:col-span-1">
          <div className="sticky top-8">
            <div className="p-6 bg-white rounded-xl shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900">Ingressos</h2>
              <div className="mt-4 space-y-4">
                {event.tickets && event.tickets.length > 0 ? (
                  event.tickets.map((ticket) => (
                    <div key={ticket.id} className="p-4 rounded-lg border">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-gray-900">{ticket.name}</h3>
                          <p className="mt-1 text-sm text-gray-500">{ticket.description}</p>
                          <p className="mt-1 text-sm text-gray-500">
                            {ticket.quantity_available} {ticket.quantity_available === 1 ? 'ingresso disponível' : 'ingressos disponíveis'}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="text-2xl font-bold text-gray-900">
                            {new Intl.NumberFormat('pt-BR', {
                              style: 'currency',
                              currency: 'BRL'
                            }).format(ticket.price)}
                          </span>
                        </div>
                      </div>
                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => updateTicketQuantity(ticket.id, (ticketQuantities[ticket.id] || 0) - 1)}
                            className="p-1 rounded-md hover:bg-gray-100"
                            disabled={!ticketQuantities[ticket.id] || ticketQuantities[ticket.id] <= 0}
                          >
                            <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                            </svg>
                          </button>
                          <span className="text-gray-900 w-6 text-center">{ticketQuantities[ticket.id] || 0}</span>
                          <button
                            onClick={() => updateTicketQuantity(ticket.id, (ticketQuantities[ticket.id] || 0) + 1)}
                            className="p-1 rounded-md hover:bg-gray-100"
                            disabled={ticketQuantities[ticket.id] >= ticket.quantity_available}
                          >
                            <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                          </button>
                        </div>
                        <button
                          onClick={() => {
                            setIsAddingToCart(true);
                            addToCart({
                              id: uuidv4(),
                              eventId: event.id,
                              eventTitle: event.title,
                              eventThumbnail: event.thumbnail,
                              eventDate: event.date,
                              ticketId: ticket.id,
                              ticketName: ticket.name,
                              price: ticket.price,
                              quantity: ticketQuantities[ticket.id] || 0,
                            });
                            router.push('/carrinho');
                          }}
                          disabled={isAddingToCart || !ticketQuantities[ticket.id] || ticketQuantities[ticket.id] <= 0}
                          className="px-4 py-2 w-full ml-4 text-white bg-primary rounded-lg transition-colors hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isAddingToCart ? 'Adicionando...' : 'Comprar Ingresso'}
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 rounded-lg border bg-gray-50">
                    <p className="text-gray-500 text-center">Nenhum ingresso disponível no momento.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

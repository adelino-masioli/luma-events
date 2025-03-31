'use client';

import { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';

interface Ticket {
  id: number;
  event_title: string;
  event_date: string;
  ticket_name: string;
  checked_in: boolean;
  check_in_time: string | null;
}

export default function TicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return;
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/tickets/`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Falha ao obter os ingressos');
        }

        const data = await response.json();
        setTickets(data);
      } catch (error) {
        console.error('Falha ao carregar seus tickets. Por favor, tente novamente:', error);
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Falha ao carregar seus tickets. Por favor, tente novamente.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [router, toast]);

  // Generate QR code data for a ticket
  const getQRCodeData = (ticket: Ticket) => {
    return JSON.stringify({
      attendee_id: ticket.id
    });
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-4">Meus ingressos</h1>
        <div className="flex justify-center items-center h-64">
          <p>Carregando tickets...</p>
        </div>
      </div>
    );
  }

  if (tickets.length === 0) {
    return (
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-4">Meus ingressos</h1>
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="mb-4">Você ainda não tem nenhum ingresso.</p>
          <button 
            onClick={() => router.push('/eventos')} 
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Explorar Eventos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-4">Meus ingressos</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tickets.map(ticket => (
          <div key={ticket.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-primary text-white p-4">
              <h2 className="text-md font-semibold">{ticket.event_title}</h2>
              <p className='text-sm'>{formatDate(ticket.event_date)}</p>
            </div>
            <div className="p-4 flex flex-col items-center">
              <p className="mb-2 text-gray-700">{ticket.ticket_name}</p>
              
              {ticket.checked_in ? (
               <>
                 <div className="my-4 p-3 bg-white border border-gray-200 rounded-md">
                  <QRCodeSVG 
                    value={getQRCodeData(ticket)} 
                    size={200} 
                    includeMargin={true} 
                    level="H" 
                    className='opacity-10'
                  />
                </div>
              
             
                  <div className="mt-2 text-green-600 font-medium text-center">
                    <p>✓ Check-in efetuado</p>
                    {ticket.check_in_time && (
                      <p className="text-sm text-gray-500">
                        em {formatDate(ticket.check_in_time)}
                      </p>
                    )}
                  </div>
               </>
              ) : (
                <>
                  <div className="my-4 p-3 bg-white border border-gray-200 rounded-md">
                    <QRCodeSVG 
                      value={getQRCodeData(ticket)} 
                      size={200} 
                      includeMargin={true} 
                      level="H" 
                    />
                  </div>
                  <p className="mt-2 text-gray-600">Ainda não efetuou check-in</p>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 
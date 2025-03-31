'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';

interface Event {
  id: number;
  title: string;
  date: string;
}

export default function HostessPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [isHostess, setIsHostess] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const checkUserPermissions = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return;
        }

        // Check if user has hostess permissions
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/profile/`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Falha ao buscar o perfil do usuário');
        }

        const userData = await response.json();
        
        if (!userData.groups || !userData.groups.includes('hostess')) {
          toast({
            variant: "destructive",
            title: "Acesso negado",
            description: "Você não tem permissão para acessar esta área.",
          });
          router.push('/');
          return;
        }

        setIsHostess(true);
        await fetchEvents(token);
      } catch (error) {
        console.error('Erro ao verificar permissões do usuário:', error);
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Falha ao verificar suas permissões. Tente novamente.",
        });
        router.push('/');
      } finally {
        setLoading(false);
      }
    };

    const fetchEvents = async (token: string) => {
      try {
        // Fetch events the hostess has access to
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/events/`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Falha ao buscar eventos');
        }

        const data = await response.json();
        setEvents(data);
      } catch (error) {
        console.error('Erro ao buscar eventos:', error);
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Falha ao carregar eventos. Tente novamente.",
        });
      } finally {
        setLoading(false);
      }
    };

    checkUserPermissions();
  }, [router, toast]);

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
        <h1 className="text-2xl font-bold mb-4">Portal do Hostess</h1>
        <div className="flex justify-center items-center h-64">
          <p>Carregando...</p>
        </div>
      </div>
    );
  }

  if (!isHostess) {
    return null; // This will be redirected by the useEffect
  }

  if (events.length === 0) {
    return (
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-4">Portal do Hostess</h1>
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="mb-4">Nenhum evento disponível para você gerenciar.</p>
          <button 
            onClick={() => router.push('/')} 
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Portal do Hostess</h1>
      <h2 className="text-xl mb-4">Selecione um evento para gerenciar:</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map(event => (
          <div 
            key={event.id} 
            className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => router.push(`/hostess/${event.id}`)}
          >
            <h3 className="text-lg font-semibold mb-2">{event.title}</h3>
            <p className="text-gray-600">{formatDate(event.date)}</p>
            <button 
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 w-full"
            >
              Gerenciar check-ins
            </button>
          </div>
        ))}
      </div>
    </div>
  );
} 
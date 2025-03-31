'use client';

import { useEffect, useState, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';

interface Attendee {
  id: number;
  user_name: string;
  event_title: string;
  event_date: string;
  ticket_name: string;
  checked_in: boolean;
  check_in_time: string | null;
}

interface EventDetails {
  id: number;
  title: string;
  date: string;
}

interface EventStats {
  checked_in: number;
  total: number;
}

export default function EventCheckInPage({ params }: { params: { eventId: string } }) {
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [event, setEvent] = useState<EventDetails | null>(null);
  const [stats, setStats] = useState<EventStats>({ checked_in: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [lastScannedId, setLastScannedId] = useState<number | null>(null);
  const [scanResult, setScanResult] = useState<{ success: boolean; message: string } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCheckedIn, setFilterCheckedIn] = useState<boolean | null>(null);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const scannerContainerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { toast } = useToast();
  const eventId = params.eventId;

  // Load event and attendees data
  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return;
        }

        // Check if user has hostess permissions
        const profileResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/profile/`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!profileResponse.ok) {
          throw new Error('Falha ao buscar o perfil do usuário');
        }

        const userData = await profileResponse.json();
        
        if (!userData.groups || !userData.groups.includes('hostess')) {
          toast({
            variant: "destructive",
            title: "Acesso negado",
            description: "Você não tem permissão para acessar esta área.",
          });
          router.push('/');
          return;
        }

        // Fetch event attendees
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/events/${eventId}/attendees/`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );

        if (!response.ok) {
          throw new Error('Falha ao buscar dados do evento');
        }

        const data = await response.json();
        setAttendees(data.attendees);
        setEvent(data.event);
        setStats(data.stats);
      } catch (error) {
        console.error('Erro ao buscar dados do evento:', error);
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Falha ao carregar dados do evento. Tente novamente.",
        });
        router.push('/hostess');
      } finally {
        setLoading(false);
      }
    };

    fetchEventData();

    // Cleanup function
    return () => {
      try {
        if (scannerRef.current) {
          console.log("Limpando o scanner ao desmontar");
          scannerRef.current.clear();
          scannerRef.current = null;
        }
      } catch (error) {
        console.error("Erro ao limpar o scanner:", error);
      }
    };
  }, [eventId, router, toast]);

  // Start QR scanner
  const startScanner = () => {
    if (scannerRef.current) {
      scannerRef.current.clear();
    }

    setScanning(true);
    setScanResult(null);
    
    // We need to give the DOM time to render the scanner container
    setTimeout(() => {
      try {
        // Make sure container exists
        if (!document.getElementById('qr-reader')) {
          console.error('Container do leitor QR não encontrado');
          setScanning(false);
          return;
        }

        const scanner = new Html5QrcodeScanner(
          "qr-reader",
          { 
            fps: 10, 
            qrbox: { width: 250, height: 250 },
            rememberLastUsedCamera: true,
            showTorchButtonIfSupported: true
          },
          false
        );

        scanner.render(onScanSuccess, onScanFailure);
        scannerRef.current = scanner;

        const qrReader = document.getElementById("qr-reader");
          if (qrReader) {
            const firstDiv = qrReader.querySelector("div");
            if (firstDiv) {
                firstDiv.style.display = "none";
            }
        }

        
      } catch (error) {
        console.error('Erro ao inicializar o QR scanner:', error);
        setScanning(false);
        toast({
          variant: "destructive",
          title: "Scanner Error",
          description: "Falha ao inicializar o scanner QR. Tente novamente.",
        });
      }
    }, 100); // Small delay to ensure DOM is ready
  };

  // Stop QR scanner
  const stopScanner = () => {
    try {
      // Remover folha de estilo de traduções quando parar o scanner
      const style = document.getElementById('qr-scanner-translations');
      if (style) {
        style.remove();
      }

      // Limpar o observer se existir
      if ((window as any).__qrObserver) {
        (window as any).__qrObserver.disconnect();
        (window as any).__qrObserver = null;
      }

      if (scannerRef.current) {
        scannerRef.current.clear();
        scannerRef.current = null;
      }
      setScanning(false);
      console.log("O scanner parou com sucesso");
    } catch (error) {
      console.error("Erro ao parar o scanner:", error);
      // Force scanning state to false even if there was an error
      setScanning(false);
    }
  };

  // Handle successful QR scan
  const onScanSuccess = async (decodedText: string) => {
    try {
      console.log("Código QR escaneado com sucesso:", decodedText);
      
      // Stop scanning temporarily to process the result
      if (scannerRef.current) {
        // Don't clear the scanner completely, just pause it
        scannerRef.current.pause();
      }
      
      // Parse the QR code data
      let qrData;
      try {
        qrData = JSON.parse(decodedText);
      } catch (e) {
        console.error("Erro ao analisar dados do código QR:", e);
        setScanResult({
          success: false,
          message: "Formato de código QR inválido. Tente novamente."
        });
        
        // Resume scanning after a short delay
        setTimeout(() => {
          if (scannerRef.current && scanning) {
            scannerRef.current.resume();
          }
        }, 2000);
        return;
      }
      
      if (!qrData.attendee_id) {
        setScanResult({
          success: false,
          message: "Formato de código QR inválido. Tente novamente."
        });
        
        // Resume scanning after a short delay
        setTimeout(() => {
          if (scannerRef.current && scanning) {
            scannerRef.current.resume();
          }
        }, 2000);
        return;
      }

      setLastScannedId(qrData.attendee_id);

      // Send the check-in request to the server
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/attendee/check-in/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ qr_data: decodedText })
        }
      );

      const data = await response.json();

      if (response.ok) {
        // Update local state
        if (data.attendee) {
          // Update the attendees list
          setAttendees(prevAttendees => 
            prevAttendees.map(attendee => 
              attendee.id === qrData.attendee_id 
                ? { ...attendee, checked_in: true, check_in_time: data.attendee.check_in_time }
                : attendee
            )
          );

          // Update stats
          setStats(prevStats => ({
            ...prevStats,
            checked_in: prevStats.checked_in + 1
          }));

          // Show success message
          setScanResult({
            success: true,
            message: data.message || "Check-in realizado com sucesso!"
          });

          toast({
            title: "Check-in bem-sucedidol",
            description: `${data.attendee.user_name} Check-in realizado com sucesso!`,
          });
        } else {
          setScanResult({
            success: true,
            message: data.message || "Check-in processado."
          });
        }
      } else {
        setScanResult({
          success: false,
          message: data.error || "Falha ao fazer check-in do participante."
        });

        toast({
          variant: "destructive",
          title: "Falha no check-in",
          description: data.error || "Falha ao fazer check-in do participante.",
        });
      }
      
      // Resume scanning after a short delay
      setTimeout(() => {
        if (scannerRef.current && scanning) {
          scannerRef.current.resume();
        }
      }, 3000);
      
    } catch (error) {
      console.error('Erro ao processar o código QR:', error);
      setScanResult({
        success: false,
        message: "Erro ao processar o código QR. Tente novamente."
      });

      toast({
        variant: "destructive",
        title: "Erro",
        description: "Falha ao processar o código QR. Tente novamente.",
      });
      
      // Resume scanning after a short delay
      setTimeout(() => {
        if (scannerRef.current && scanning) {
          scannerRef.current.resume();
        }
      }, 2000);
    }
  };

  // Handle scan failure
  const onScanFailure = (error: string) => {
    // Don't log frequent scan failures to avoid console spam
    // Only log if it seems like a real error
    if (error && !error.includes("Nenhum código QR encontrado")) {
      console.log(`Erro de leitura de QR: ${error}`);
    }
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

  // Function to manually check in an attendee
  const handleManualCheckIn = async (attendeeId: number) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      // Create the same format as QR data for consistency
      const qrData = JSON.stringify({ attendee_id: attendeeId });

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/attendee/check-in/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ qr_data: qrData })
        }
      );

      const data = await response.json();

      if (response.ok) {
        // Update local state
        if (data.attendee) {
          // Highlight the last checked in attendee
          setLastScannedId(attendeeId);
          
          // Update the attendees list
          setAttendees(prevAttendees => 
            prevAttendees.map(attendee => 
              attendee.id === attendeeId 
                ? { ...attendee, checked_in: true, check_in_time: data.attendee.check_in_time }
                : attendee
            )
          );

          // Update stats
          setStats(prevStats => ({
            ...prevStats,
            checked_in: prevStats.checked_in + 1
          }));

          toast({
            title: "Check-in bem-sucedido",
            description: `${data.attendee.user_name} foi verificado em.`,
          });
        }
      } else {
        toast({
          variant: "destructive",
          title: "Falha no check-in",
          description: data.error || "Falha ao fazer check-in do participante.",
        });
      }
    } catch (error) {
      console.error('Erro ao verificar o participante:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Falha ao fazer check-in do participante. Tente novamente.",
      });
    }
  };

  // Filter attendees based on search term and check-in status
  const filteredAttendees = attendees.filter(attendee => {
    // Filter by name
    const nameMatches = attendee.user_name.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by check-in status if a filter is selected
    const statusMatches = filterCheckedIn === null || attendee.checked_in === filterCheckedIn;
    
    return nameMatches && statusMatches;
  });

  // Check if there are any attendees who haven't been checked in yet
  const hasUncheckedAttendees = attendees.some(attendee => !attendee.checked_in);

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-4">Event Check-in</h1>
        <div className="flex justify-center items-center h-64">
          <p>Carregando dados do evento...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-4">Event Check-in</h1>
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="mb-4">Evento não encontrado ou você não tem permissão para gerenciá-lo.</p>
          <button 
            onClick={() => router.push('/hostess')} 
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Voltar para Eventos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-4 sm:py-8 px-2 sm:px-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">{event.title}</h1>
          <p className="text-gray-600">{formatDate(event.date)}</p>
        </div>
        <button 
          onClick={() => router.push('/hostess')} 
          className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 w-full sm:w-auto"
        >
          Listagem de eventos
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-8">
        {/* QR Scanner Section */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 lg:col-span-2">
          <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">QR Code Scanner</h2>
          
          <div className="mb-4">
            <p className="mb-2">Presença: <strong>{stats.checked_in}</strong> de <strong>{stats.total}</strong> verificado em</p>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-blue-600 h-2.5 rounded-full" 
                style={{ width: `${stats.total > 0 ? (stats.checked_in / stats.total) * 100 : 0}%` }}
              ></div>
            </div>
          </div>

          {scanning ? (
            <div className="scanner-container">
              <div id="qr-reader" className="mx-auto max-w-full sm:max-w-xs"></div>
              <button 
                onClick={stopScanner} 
                className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 w-full"
              >
                Parar o scanner
              </button>
            </div>
          ) : (
            <button 
              onClick={startScanner} 
              className={`w-full px-4 py-2 rounded-md ${
                hasUncheckedAttendees 
                  ? 'bg-blue-600 text-white hover:bg-blue-700' 
                  : 'bg-blue-300 text-white cursor-not-allowed'
              }`}
              disabled={!hasUncheckedAttendees}
            >
              {hasUncheckedAttendees 
                ? 'Iniciar Scanner' 
                : 'Todos os participantes fizeram check-in'}
            </button>
          )}

          {scanResult && (
            <div className={`mt-4 p-4 rounded-md ${scanResult.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              <p className="font-medium">{scanResult.message}</p>
              {lastScannedId && (
                <p className="mt-2">
                  ID: {lastScannedId}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Attendees List Section */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 lg:col-span-3">
          <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Participantes</h2>
          
          {/* Search and Filter Controls */}
          <div className="mb-4 flex flex-col sm:flex-row gap-2">
            <div className="flex-1 min-w-0">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por nome..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="flex space-x-1 sm:space-x-2">
              <button
                onClick={() => setFilterCheckedIn(null)}
                className={`px-2 sm:px-3 py-2 rounded-md text-sm ${
                  filterCheckedIn === null 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-800'
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => setFilterCheckedIn(true)}
                className={`px-2 sm:px-3 py-2 rounded-md text-sm ${
                  filterCheckedIn === true 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-800'
                }`}
              >
                Check-in efetuado
              </button>
              <button
                onClick={() => setFilterCheckedIn(false)}
                className={`px-2 sm:px-3 py-2 rounded-md text-sm ${
                  filterCheckedIn === false 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-800'
                }`}
              >
                Não verificado
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-100">
                <tr>
                  <th className="text-left py-2 sm:py-3 px-4 font-semibold text-xs sm:text-sm">Nome</th>
                  <th className="text-left py-2 sm:py-3 px-4 font-semibold text-xs sm:text-sm">Ticket</th>
                  <th className="text-left py-2 sm:py-3 px-4 font-semibold text-xs sm:text-sm">Status</th>
                  <th className="text-left py-2 sm:py-3 px-4 font-semibold text-xs sm:text-sm">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredAttendees.map(attendee => (
                  <tr key={attendee.id} className={lastScannedId === attendee.id ? 'bg-blue-50' : ''}>
                    <td className="py-3 px-4 text-xs sm:text-sm">{attendee.user_name}</td>
                    <td className="py-3 px-4 text-xs sm:text-sm">{attendee.ticket_name}</td>
                    <td className="py-3 px-4 text-xs sm:text-sm">
                      {attendee.checked_in ? (
                        <div className="text-green-600">
                          
                          {attendee.check_in_time && (
                            <div className="text-xs sm:text-sm">
                              <span className="inline-block mr-1">✓</span> {formatDate(attendee.check_in_time)}
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-500">Não verificado</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {!attendee.checked_in && (
                        <button
                          onClick={() => handleManualCheckIn(attendee.id)}
                          className="bg-blue-600 text-white text-xs py-1 px-3 rounded-md hover:bg-blue-700"
                        >
                          Check in
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {filteredAttendees.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-4 px-4 text-center text-gray-500">
                      {attendees.length === 0 
                        ? "Nenhum participante encontrado para este evento." 
                        : searchTerm 
                          ? `Nenhum participante correspondente "${searchTerm}"` 
                          : filterCheckedIn === true 
                            ? "Nenhum participante com check-in efetuados" 
                            : filterCheckedIn === false 
                              ? "Todos os participantes fizeram o check-in" 
                              : "Nenhum participante encontrado."
                      }
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
} 
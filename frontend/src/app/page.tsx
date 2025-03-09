import Image from "next/image";
import Link from "next/link";
import { Event } from "../types";
import {  getEvents } from "@/services/api";
import EventCard from "@/components/events/event-card";

// Function to format price
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(price);
};

// Function to format date
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(date);
};


export default async function Home() {
  const events: Event[] = await getEvents();
  const latestEvents = events.slice(0, 8);
  
  // Get unique cities from events
  const cities = Array.from(new Set(events.map(event => event.city))).sort();
  
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white py-16 sm:py-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Descubra os Melhores Eventos de Rondônia
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl">
                Encontre e compre ingressos para os eventos mais esperados da região Norte do Brasil. Shows, festivais, exposições e muito mais!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Link 
                  href="/eventos" 
                  className="btn-primary"
                >
                  Ver Todos os Eventos
                </Link>
                <Link 
                  href="/sobre" 
                  className="btn-secondary"
                >
                  Saiba Mais
                </Link>
              </div>
            </div>
            <div className="flex-1 relative">
              <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100">
                <Image 
                  src="https://placehold.co/800x600/png" 
                  alt="Eventos em Rondônia"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                  priority
                />
              </div>
              <div className="absolute -bottom-4 -right-4 bg-white p-4 rounded-xl shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">+50 Eventos</p>
                    <p className="text-xs text-gray-500">Este mês</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* City Filters */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Escolha sua Cidade</h2>
            <p className="text-gray-600">Encontre eventos próximos a você em Rondônia</p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {cities.map((city) => (
              <Link 
                key={city} 
                href={`/eventos?cidade=${encodeURIComponent(city)}`}
                className="city-badge"
              >
                {city}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Events */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12">
            <div>
              <h2 className="section-title">Próximos Eventos</h2>
              <p className="section-subtitle">Não perca os eventos mais aguardados da região</p>
            </div>
            <Link 
              href="/eventos" 
              className="btn-secondary inline-flex items-center gap-2"
            >
              Ver todos
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {latestEvents.map((event) => (
              <EventCard key={event.id} event={event}  />
            ))}
          </div>
        </div>
      </section>

      {/* Advertisement Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="ad-section">
            <div className="flex flex-col md:flex-row items-center p-8 md:p-12">
              <div className="md:w-1/2 p-8 md:p-12">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Patrocine Seus Eventos</h2>
                <p className="text-white/90 mb-6">Aumente a visibilidade do seu evento alcançando milhares de pessoas interessadas em Rondônia.</p>
                <a href="/contato" className="inline-block bg-white text-purple-600 font-medium py-2 px-6 rounded-full hover:bg-gray-100 transition duration-300">
                  Saiba Mais
                </a>
              </div>
              <div className="md:w-1/2 relative h-64 md:h-80">
                <Image 
                  src="https://placehold.co/800x600/png" 
                  alt="Anuncie seu evento"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
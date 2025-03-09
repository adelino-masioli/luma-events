import Image from "next/image";
import Link from "next/link";
import { Event, Category } from "../../types";
import { getEvents, getCategories } from "../../services/api";  // Importando as funções de API
import EventCard from "@/components/events/event-card";

// Função para formatar preço
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(price);
};

// Função para formatar data
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(date);
};

export default async function EventsPage() {
  // Pegando os eventos e categorias do serviço de API
  const events: Event[] = await getEvents();
  const categories = await getCategories();

  // Pegando as cidades únicas dos eventos
  const cities = events
    ? Array.from(new Set(events.map(event => String(event.city)))).sort()
    : [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Seção Hero */}
      <section className="bg-white border-b">
        <div className="container py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Eventos em Rondônia</h1>
          <p className="text-gray-600 max-w-2xl">
            Descubra os melhores eventos da região. Shows, festivais, exposições e muito mais!
          </p>
        </div>
      </section>

      <div className="container py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar de Filtros */}
          <aside className="lg:w-64 space-y-6">
            {/* Categorias */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="font-semibold text-gray-900 mb-4">Categorias</h3>
              <div className="space-y-2">
                {categories.map((category: Category) => (
                  <label key={category.id} className="flex items-center">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span className="ml-2 text-sm text-gray-600">{category.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Cidades */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="font-semibold text-gray-900 mb-4">Cidades</h3>
              <div className="space-y-2">
                {cities.map((city) => (
                  <label key={city} className="flex items-center">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span className="ml-2 text-sm text-gray-600">{city}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Faixa de Preço */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="font-semibold text-gray-900 mb-4">Faixa de Preço</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">Mínimo</label>
                  <input
                    type="number"
                    placeholder="R$ 0"
                    className="w-full rounded-md border-gray-300 focus:border-primary focus:ring focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">Máximo</label>
                  <input
                    type="number"
                    placeholder="R$ 1000"
                    className="w-full rounded-md border-gray-300 focus:border-primary focus:ring focus:ring-primary/20"
                  />
                </div>
              </div>
            </div>
          </aside>

          {/* Grid de Eventos */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-600">
                <span className="font-medium text-gray-900">{events.length}</span> eventos encontrados
              </p>
              <select className="rounded-md border-gray-300 text-gray-600 focus:border-primary focus:ring focus:ring-primary/20">
                <option>Mais Recentes</option>
                <option>Menor Preço</option>
                <option>Maior Preço</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <EventCard key={event.id} event={event}/>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

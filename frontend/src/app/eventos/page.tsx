import Image from "next/image";
import Link from "next/link";
import { Event, Category } from "../../types";
import { getEvents, getCategories } from "../../services/api";
import EventCard from "@/components/events/event-card";
import CityFilters from "@/components/layout/city-filter";
import PriceFilter from "@/components/layout/price-filter";
import CategoryFilter from "@/components/layout/category-filter";
import SortSelect from "@/components/layout/sort-select";
import SearchInput from "@/components/layout/search-input";

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

// Tipos de ordenação
type SortOption = 'relevancia' | 'recentes' | 'menor-preco' | 'maior-preco';

// Função para ordenar eventos
const sortEvents = (events: Event[], sortBy: SortOption) => {
  const eventsCopy = [...events];

  switch (sortBy) {
    case 'recentes':
      return eventsCopy.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    case 'menor-preco':
      return eventsCopy.sort((a, b) => a.price - b.price);
    case 'maior-preco':
      return eventsCopy.sort((a, b) => b.price - a.price);
    default: // 'relevancia'
      return eventsCopy; // Mantém a ordem original
  }
};

// Função para normalizar texto (remover acentos e converter para minúsculas)
const normalizeText = (text: string) => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
};

export default async function EventsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  // Pegando os eventos e categorias do serviço de API
  const events: Event[] = await getEvents();
  const categories = await getCategories();
  const selectedCity = searchParams.cidade as string;
  const minPrice = searchParams.preco_min ? Number(searchParams.preco_min) : undefined;
  const maxPrice = searchParams.preco_max ? Number(searchParams.preco_max) : undefined;
  const selectedCategories = searchParams.categorias ? (searchParams.categorias as string).split(',') : [];
  const sortBy = (searchParams.ordenar as SortOption) || 'relevancia';
  const searchTerm = searchParams.busca as string;

  // Criar um mapa de ID para nome da categoria
  const categoryMap = new Map(categories.map(cat => [cat.id.toString(), cat.name]));

  // Filtrando eventos por cidade, preço, categorias e termo de busca
  const filteredEvents = events.filter(event => {
    // Filtro por termo de busca
    if (searchTerm) {
      const searchNormalized = normalizeText(searchTerm);
      const matchesSearch = 
        normalizeText(event.title).includes(searchNormalized) ||
        normalizeText(event.description).includes(searchNormalized) ||
        normalizeText(event.category).includes(searchNormalized) ||
        normalizeText(event.city).includes(searchNormalized);
      
      if (!matchesSearch) {
        return false;
      }
    }

    // Filtro por cidade
    if (selectedCity && event.city !== selectedCity) {
      return false;
    }
    
    // Filtro por preço mínimo
    if (minPrice !== undefined && event.price < minPrice) {
      return false;
    }
    
    // Filtro por preço máximo
    if (maxPrice !== undefined && event.price > maxPrice) {
      return false;
    }

    // Filtro por categorias
    if (selectedCategories.length > 0) {
      // Convertendo os IDs selecionados para nomes de categorias
      const selectedCategoryNames = selectedCategories
        .map(id => categoryMap.get(id))
        .filter((name): name is string => name !== undefined);
      
      return selectedCategoryNames.includes(event.category);
    }
    
    return true;
  });

  // Ordenar eventos
  const sortedEvents = sortEvents(filteredEvents, sortBy);

  // Encontrar preço mínimo e máximo dos eventos
  const eventPrices = events.map(event => event.price);
  const validPrices = eventPrices.filter((price): price is number => typeof price === 'number' && !isNaN(price));
  const lowestPrice = validPrices.length > 0 ? Math.min(...validPrices) : 0;
  const highestPrice = validPrices.length > 0 ? Math.max(...validPrices) : 1000;

  // Pegando as cidades únicas dos eventos
  const cities = Array.from(new Set(events.map(event => String(event.city)))).sort();

  // Função para formatar os filtros ativos
  const getActiveFiltersText = () => {
    const filters = [];
    
    if (minPrice !== undefined || maxPrice !== undefined) {
      const priceText = minPrice !== undefined && maxPrice !== undefined
        ? `${formatPrice(minPrice)} - ${formatPrice(maxPrice)}`
        : minPrice !== undefined
        ? `Min: ${formatPrice(minPrice)}`
        : maxPrice !== undefined
        ? `Max: ${formatPrice(maxPrice)}`
        : '';
      
      if (priceText) {
        filters.push(priceText);
      }
    }

    if (selectedCategories.length > 0) {
      const categoryNames = selectedCategories
        .map(id => categoryMap.get(id))
        .filter((name): name is string => name !== undefined)
        .join(', ');
      if (categoryNames) {
        filters.push(categoryNames);
      }
    }

    return filters.length > 0 ? `(${filters.join(' • ')})` : '';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Seção Hero */}
      <section className="bg-white border-b">
        <div className="container py-8 flex flex-col">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {selectedCity ? `Eventos em ${selectedCity}` : 'Eventos em Rondônia'}
          </h1>
          <div className="flex  gap-4   flex-col">
            
            <p className="text-gray-600 max-w-2xl">
              Descubra os melhores eventos da região. Shows, festivais, exposições e muito mais!
            </p>

          </div>
        </div>
      </section>

      {/* City Filters */}
      <CityFilters cities={cities} />

      <div className="container py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar de Filtros */}
          <aside className="lg:w-64 space-y-6 pt-1">

            <div className="bg-white p-6 rounded-lg shadow-sm border mt-16">
              <h3 className="font-semibold text-gray-900 mb-4">Buscar Eventos</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <SearchInput 
                    className="relative w-full"
                    inputClassName="header-search w-full text-sm"
                    iconClassName="h-5 w-5 text-gray-400"
                    autoSearch={true}
                  />
                </div>
              </div>
            </div>
           

            {/* Categorias */}
            <CategoryFilter categories={categories} />

            {/* Filtro de Preço */}
            <PriceFilter minPrice={lowestPrice} maxPrice={highestPrice} />
          </aside>

          {/* Grid de Eventos */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-600">
                <span className="font-medium text-gray-900">{sortedEvents.length}</span> eventos encontrados
                <span className="text-sm text-gray-500 ml-2">
                  {getActiveFiltersText()}
                </span>
              </p>
              <SortSelect currentSort={sortBy} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedEvents.map((event) => (
                <EventCard key={event.id} event={event}/>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

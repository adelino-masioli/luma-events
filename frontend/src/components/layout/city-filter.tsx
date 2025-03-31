'use client';

import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface CityFiltersProps {
  cities: string[];
}

const CityFilters: React.FC<CityFiltersProps> = ({ cities }) => {
  const searchParams = useSearchParams();
  const currentCity = searchParams.get('cidade');

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Título e descrição */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Escolha sua Cidade</h2>
          <p className="text-gray-600">Encontre eventos próximos a você em Rondônia</p>
        </div>

        {/* Lista de cidades */}
        <div className="flex flex-wrap justify-center gap-3">
          {currentCity && (
            <Link 
              href="/eventos"
              className="city-badge clear-filter  flex items-center gap-2"
            >
              Limpar filtro
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </Link>
          )}
          {cities.map((city) => (
            <Link 
              key={city} 
              href={`/eventos?cidade=${encodeURIComponent(city)}`}
              className={`city-badge ${currentCity === city ? 'active' : ''}`}
            >
              {city}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CityFilters;

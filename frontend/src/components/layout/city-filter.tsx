import Link from "next/link";

interface CityFiltersProps {
  cities: string[];
}

const CityFilters: React.FC<CityFiltersProps> = ({ cities }) => {
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
  );
};

export default CityFilters;

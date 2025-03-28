'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

interface PriceFilterProps {
  minPrice?: number;
  maxPrice?: number;
}

const PriceFilter: React.FC<PriceFilterProps> = ({ minPrice = 0, maxPrice = 1000 }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const [min, setMin] = useState(searchParams.get('preco_min') || '');
  const [max, setMax] = useState(searchParams.get('preco_max') || '');

  // Atualiza a URL quando clicar em filtrar
  const updatePrice = () => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    
    // Remove os parâmetros se estiverem vazios
    if (!min) current.delete('preco_min');
    else current.set('preco_min', min);
    
    if (!max) current.delete('preco_max');
    else current.set('preco_max', max);

    // Preserva outros parâmetros como cidade
    const search = current.toString();
    const query = search ? `?${search}` : '';
    
    router.push(`${pathname}${query}`);
  };

  // Limpar filtros
  const clearFilters = () => {
    setMin('');
    setMax('');
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    current.delete('preco_min');
    current.delete('preco_max');
    const search = current.toString();
    const query = search ? `?${search}` : '';
    router.push(`${pathname}${query}`);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h3 className="font-semibold text-gray-900 mb-4">Faixa de Preço</h3>
      <div className="space-y-4">
        <div>
          <label className="text-sm text-gray-600 mb-1 block">Mínimo</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">R$</span>
            <input
              type="number"
              value={min}
              onChange={(e) => setMin(e.target.value)}
              placeholder={minPrice.toString()}
              min={minPrice}
              max={maxPrice}
              className="w-full pl-8 rounded-md border-gray-300 focus:border-primary focus:ring focus:ring-primary/20"
            />
          </div>
        </div>
        <div>
          <label className="text-sm text-gray-600 mb-1 block">Máximo</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">R$</span>
            <input
              type="number"
              value={max}
              onChange={(e) => setMax(e.target.value)}
              placeholder={maxPrice.toString()}
              min={minPrice}
              max={maxPrice}
              className="w-full pl-8 rounded-md border-gray-300 focus:border-primary focus:ring focus:ring-primary/20"
            />
          </div>
        </div>
        
        {/* Botões de ação */}
        <div className="flex flex-col gap-2">
          <button
            onClick={updatePrice}
            className="w-full py-2 px-4 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filtrar
          </button>
          
          {(min || max) && (
            <button
              onClick={clearFilters}
              className="w-full text-sm text-gray-600 hover:text-primary flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Limpar filtro de preço
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PriceFilter; 
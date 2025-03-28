'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Category } from '@/types';

interface CategoryFilterProps {
  categories: Category[];
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ categories }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // Inicializa o estado com as categorias selecionadas da URL
  const [selectedCategories, setSelectedCategories] = useState<string[]>(() => {
    const categoriesParam = searchParams.get('categorias');
    return categoriesParam ? categoriesParam.split(',') : [];
  });

  // Atualiza a URL quando clicar em filtrar
  const updateCategories = () => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    
    if (selectedCategories.length === 0) {
      current.delete('categorias');
    } else {
      current.set('categorias', selectedCategories.join(','));
    }

    // Preserva outros parâmetros como cidade e preço
    const search = current.toString();
    const query = search ? `?${search}` : '';
    
    router.push(`${pathname}${query}`);
  };

  // Limpar filtros
  const clearFilters = () => {
    setSelectedCategories([]);
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    current.delete('categorias');
    const search = current.toString();
    const query = search ? `?${search}` : '';
    router.push(`${pathname}${query}`);
  };

  // Toggle categoria selecionada
  const toggleCategory = (categoryId: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(categoryId)) {
        return prev.filter(id => id !== categoryId);
      } else {
        return [...prev, categoryId];
      }
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h3 className="font-semibold text-gray-900 mb-4">Categorias</h3>
      <div className="space-y-4">
        <div className="space-y-2">
          {categories.map((category) => (
            <label key={category.id} className="flex items-center">
              <input
                type="checkbox"
                checked={selectedCategories.includes(category.id.toString())}
                onChange={() => toggleCategory(category.id.toString())}
                className="rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="ml-2 text-sm text-gray-600">{category.name}</span>
            </label>
          ))}
        </div>
        
        {/* Botões de ação */}
        <div className="flex flex-col gap-2">
          <button
            onClick={updateCategories}
            className="w-full py-2 px-4 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filtrar
          </button>
          
          {selectedCategories.length > 0 && (
            <button
              onClick={clearFilters}
              className="w-full text-sm text-gray-600 hover:text-primary flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Limpar filtro de categorias
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryFilter; 
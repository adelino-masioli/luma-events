'use client';

import { useRouter, useSearchParams } from 'next/navigation';

type SortOption = 'relevancia' | 'recentes' | 'menor-preco' | 'maior-preco';

interface SortSelectProps {
  currentSort: SortOption;
}

export default function SortSelect({ currentSort }: SortSelectProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Função para atualizar a ordenação
  const handleSort = (newSort: SortOption) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (newSort === 'relevancia') {
      params.delete('ordenar');
    } else {
      params.set('ordenar', newSort);
    }

    const search = params.toString();
    const query = search ? `?${search}` : '';
    router.push(`${window.location.pathname}${query}`);
  };

  return (
    <select 
      className="rounded-md border-gray-300 text-gray-600 focus:border-primary focus:ring focus:ring-primary/20"
      value={currentSort}
      onChange={(e) => {
        const newSort = e.target.value as SortOption;
        handleSort(newSort);
      }}
    >
      <option value="relevancia">Mais Relevantes</option>
      <option value="recentes">Mais Recentes</option>
      <option value="menor-preco">Menor Preço</option>
      <option value="maior-preco">Maior Preço</option>
    </select>
  );
} 
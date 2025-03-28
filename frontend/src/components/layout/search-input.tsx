'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface SearchInputProps {
  className?: string;
  inputClassName?: string;
  iconClassName?: string;
  placeholder?: string;
  autoSearch?: boolean;
}

export default function SearchInput({ 
  className = "relative flex-1 max-w-lg",
  inputClassName = "block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm",
  iconClassName = "h-5 w-5 text-gray-400",
  placeholder = "Buscar eventos...",
  autoSearch = false
}: SearchInputProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('busca') || '');
  const [debouncedTerm, setDebouncedTerm] = useState(searchTerm);

  // Atualiza o estado quando o parâmetro de busca muda
  useEffect(() => {
    setSearchTerm(searchParams.get('busca') || '');
  }, [searchParams]);

  // Debounce para busca automática
  useEffect(() => {
    if (!autoSearch) return;
    
    const timer = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, autoSearch]);

  // Efeito para realizar a busca quando o termo debounced mudar
  useEffect(() => {
    if (!autoSearch) return;
    handleSearch(debouncedTerm);
  }, [debouncedTerm]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSearch = (term: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (term) {
      params.set('busca', term);
    } else {
      params.delete('busca');
    }

    const search = params.toString();
    const query = search ? `?${search}` : '';
    router.push(`${window.location.pathname}${query}`);
  };

  return (
    <div className={className}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <MagnifyingGlassIcon className={iconClassName} aria-hidden="true" />
      </div>
      <input
        type="text"
        className={inputClassName}
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyUp={(e) => {
          if (e.key === 'Enter') {
            handleSearch(searchTerm);
          }
        }}
      />
    </div>
  );
} 
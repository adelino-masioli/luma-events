'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/auth-context';

export default function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(username, password);
    } catch (err: any) {
      // Tenta extrair uma mensagem de erro mais específica
      const errorMessage = err.message || 'Usuário ou senha inválidos';
      
      // Traduz mensagens de erro comuns para o português
      let userFriendlyMessage = 'Usuário ou senha inválidos';
      
      if (errorMessage.includes('Unauthorized access')) {
        userFriendlyMessage = 'Este usuário não tem permissão para acessar o portal de clientes';
      } else if (errorMessage.includes('Token not found')) {
        userFriendlyMessage = 'Erro no servidor. Por favor, tente novamente mais tarde.';
      } else if (errorMessage.includes('Failed to fetch user details')) {
        userFriendlyMessage = 'Erro ao buscar seus dados. Por favor, tente novamente.';
      }
      
      setError(userFriendlyMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      <div className="space-y-4 rounded-md shadow-sm">
        <div>
          <label htmlFor="username" className="sr-only">
            Nome de usuário
          </label>
          <input
            id="username"
            name="username"
            type="text"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="relative block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-primary focus:ring-primary sm:text-sm"
            placeholder="Nome de usuário"
          />
        </div>
        <div>
          <label htmlFor="password" className="sr-only">
            Senha
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="relative block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-primary focus:ring-primary sm:text-sm"
            placeholder="Senha"
          />
        </div>
      </div>

      {error && (
        <div className="text-sm text-red-600 text-center">
          {error}
        </div>
      )}

      <div>
        <button
          type="submit"
          disabled={loading}
          className="group relative flex w-full justify-center rounded-lg border border-transparent bg-primary px-4 py-3 text-sm font-medium text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </div>
    </form>
  );
}

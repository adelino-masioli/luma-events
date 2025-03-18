'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

// Configuração da URL base da API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';

interface User {
  id: number;
  username: string;
  email: string;
  groups: string[];
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  register: (username: string, email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check for stored token and user data
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    try {

      const response = await fetch(`${API_BASE_URL}/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      
      // Tenta obter detalhes do erro mesmo se não for ok
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.detail || 'Login failed');
      }

      
      // Verifica se o token está no formato esperado
      if (!data.access) {

        throw new Error('Token not found in response');
      }
      
      // Store the token
      localStorage.setItem('token', data.access);
      
      // Fetch user details
      const userResponse = await fetch(`${API_BASE_URL}/user/profile/`, {
        headers: {
          'Authorization': `Bearer ${data.access}`,
        },
      });

      
      if (!userResponse.ok) {
        const errorData = await userResponse.json().catch(() => ({}));
        throw new Error('Failed to fetch user details');
      }

      const userData = await userResponse.json();
      
      const user = {
        id: userData.id,
        username: userData.username,
        email: userData.email,
        groups: userData.groups || [],
      };

      setUser(user);
      localStorage.setItem('user', JSON.stringify(user));
      router.push('/perfil');
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    router.push('/');
  };

  const register = async (username: string, email: string, password: string) => {
    try {
      console.log('Iniciando registro para:', username);
      
      const response = await fetch(`${API_BASE_URL}/register/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });
      
      // Tenta obter detalhes mesmo se não for ok
      const data = await response.json().catch(() => ({}));
      
      if (!response.ok) {
        throw new Error(data.detail || 'Registration failed');
      }

      // Automatically login after successful registration
      await login(username, password);
    } catch (error) {
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
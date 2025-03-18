'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { getUserProfile, updateUserProfile, getUserOrders, getStates, getCities } from '@/services/api';
import { State, City } from '@/types';
import { useRouter } from 'next/navigation';

interface UserProfile {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  profile: {
    state: State | null;
    city: City | null;
    cpf: string;
  };
}

interface Order {
  id: number;
  event_title: string;
  event_date: string;
  total_price: number;
  platform_fee: number;
  status: string;
}

export default function ProfileContent() {
  const { user, loading: authLoading, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('profile');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [states, setStates] = useState<State[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [selectedState, setSelectedState] = useState<number | null>(null);
  const [filteredCities, setFilteredCities] = useState<City[]>([]);

  const loadUserData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const [profileData, ordersData] = await Promise.all([
        getUserProfile(),
        getUserOrders()
      ]);
      
      setProfile(profileData);
      setOrders(ordersData);
      return true;
    } catch (err) {
      if (err instanceof Error && err.message === 'Session expired') {
        throw err;
      }
      setError('Erro ao carregar dados do usuário. Por favor, tente novamente.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Effect 1: Handle authentication and data loading
  useEffect(() => {
    const handleSessionExpired = () => {
      setError('Sua sessão expirou. Por favor, faça login novamente.');
      setTimeout(() => {
        logout();
        router.push('/login');
      }, 2000);
    };

    const loadData = async () => {
      if (!authLoading && !user) {
        router.push('/login');
        return;
      }

      if (user) {
        try {
          await loadUserData();
        } catch (err) {
          if (err instanceof Error && err.message === 'Session expired') {
            handleSessionExpired();
          }
        }
      }
    };

    loadData();
  }, [user, authLoading, router, logout]);

  // Effect 2: Load states
  useEffect(() => {
    const fetchStates = async () => {
      try {
        const data = await getStates();
        setStates(data);
      } catch (err) {
        console.error('Erro ao carregar estados:', err);
      }
    };

    fetchStates();
  }, []);

  // Effect 3: Load cities when state changes
  useEffect(() => {
    const fetchCities = async () => {
      if (selectedState) {
        try {
          const data = await getCities(selectedState);
          setCities(data);
          setFilteredCities(data);
        } catch (err) {
          console.error('Erro ao carregar cidades:', err);
        }
      } else {
        setFilteredCities([]);
      }
    };

    fetchCities();
  }, [selectedState]);

  // Effect 4: Update selected state when profile changes
  useEffect(() => {
    if (profile?.profile?.state) {
      setSelectedState(profile.profile.state.id);
    }
  }, [profile]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!profile) return;

    try {
      const updateData = {
        first_name: profile.first_name,
        last_name: profile.last_name,
        profile: {
          state_id: profile.profile.state?.id || null,
          city_id: profile.profile.city?.id || null
        }
      };

      await updateUserProfile(updateData);
      setSuccessMessage('Perfil atualizado com sucesso!');
      setIsEditing(false);
      
      // Recarrega os dados do perfil para garantir que tudo está sincronizado
      await loadUserData();
    } catch (err: any) {
      // Trata erros específicos do backend
      if (err.response?.data) {
        const errorData = err.response.data;
        // Verifica se há erros no perfil
        if (errorData.profile) {
          // Prioriza erros de CPF
          if (errorData.profile.cpf) {
            setError(Array.isArray(errorData.profile.cpf) ? errorData.profile.cpf[0] : errorData.profile.cpf);
          }
          // Depois verifica erros de estado
          else if (errorData.profile.state) {
            setError(Array.isArray(errorData.profile.state) ? errorData.profile.state[0] : errorData.profile.state);
          }
          // Por fim, verifica erros de cidade
          else if (errorData.profile.city) {
            setError(Array.isArray(errorData.profile.city) ? errorData.profile.city[0] : errorData.profile.city);
          }
        }
        // Se não houver erros específicos do perfil, verifica outros erros
        else if (errorData.detail) {
          setError(errorData.detail);
        }
        // Mensagem genérica se não houver erros específicos
        else {
          setError('Erro ao atualizar perfil. Por favor, verifique os dados e tente novamente.');
        }
      }
      // Trata erros gerais
      else if (err instanceof Error) {
        setError(`Erro ao atualizar perfil: ${err.message}`);
      }
      else {
        setError('Erro ao atualizar perfil');
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'cpf') {
      setProfile(prev => prev ? {
        ...prev,
        profile: {
          ...prev.profile,
          cpf: value
        }
      } : null);
    } else {
      setProfile(prev => prev ? { ...prev, [name]: value } : null);
    }
  };

  const handleStateChange = (stateId: string) => {
    const id = parseInt(stateId);
    setSelectedState(id);
    if (isEditing) {
      setProfile(prev => prev ? {
        ...prev,
        profile: {
          ...prev.profile,
          state: states.find(s => s.id === id) || null,
          city: null
        }
      } : null);
    }
  };

  const handleCityChange = (cityId: string) => {
    const id = parseInt(cityId);
    if (isEditing) {
      setProfile(prev => prev ? {
        ...prev,
        profile: {
          ...prev.profile,
          city: cities.find(c => c.id === id) || null
        }
      } : null);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="animate-pulse text-center">Carregando...</div>
    );
  }

  if (!user) {
    return null; // Let the useEffect handle the redirect
  }

  return (
    <>
      {/* Navigation Tabs */}
      <div className="border-b">
        <nav className="flex -mb-px">
          <button
            onClick={() => setActiveTab('profile')}
            className={`py-4 px-6 text-sm font-medium border-b-2 ${
              activeTab === 'profile'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Perfil
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`py-4 px-6 text-sm font-medium border-b-2 ${
              activeTab === 'orders'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Pedidos
          </button>
        </nav>
      </div>

      {/* Content */}
      <div className="p-6">
        {error && (
          <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-lg">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-4 bg-green-50 text-green-600 rounded-lg">
            {successMessage}
          </div>
        )}

        {activeTab === 'profile' && profile && (
          <form onSubmit={handleProfileUpdate} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                  Nome de usuário
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={profile.username}
                  disabled={true}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-primary focus:ring-primary disabled:bg-gray-100"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={profile.email}
                  disabled={true}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-primary focus:ring-primary disabled:bg-gray-100"
                />
              </div>

              <div>
                <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">
                  Nome
                </label>
                <input
                  type="text"
                  id="first_name"
                  name="first_name"
                  value={profile.first_name}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-primary focus:ring-primary disabled:bg-gray-100"
                />
              </div>

              <div>
                <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">
                  Sobrenome
                </label>
                <input
                  type="text"
                  id="last_name"
                  name="last_name"
                  value={profile.last_name}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-primary focus:ring-primary disabled:bg-gray-100"
                />
              </div>

              <div>
                <label htmlFor="cpf" className="block text-sm font-medium text-gray-700">
                  CPF
                </label>
                <input
                  type="text"
                  id="cpf"
                  name="cpf"
                  value={profile.profile.cpf}
                  disabled={true}
                  maxLength={11}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-primary focus:ring-primary disabled:bg-gray-100"
                />
              </div>

              <div>
                <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                  Estado
                </label>
                <select
                  id="state"
                  name="state"
                  value={profile.profile.state?.id || ''}
                  onChange={(e) => handleStateChange(e.target.value)}
                  disabled={!isEditing}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-primary focus:ring-primary disabled:bg-gray-100"
                >
                  <option value="">Selecione um estado</option>
                  {states.map((state) => (
                    <option key={state.id} value={state.id}>
                      {state.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                  Cidade
                </label>
                <select
                  id="city"
                  name="city"
                  value={profile.profile.city?.id || ''}
                  onChange={(e) => handleCityChange(e.target.value)}
                  disabled={!isEditing || !selectedState}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-primary focus:ring-primary disabled:bg-gray-100"
                >
                  <option value="">Selecione uma cidade</option>
                  {filteredCities.map((city) => (
                    <option key={city.id} value={city.id}>
                      {city.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              {!isEditing ? (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  Editar perfil
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  >
                    Salvar alterações
                  </button>
                </>
              )}
            </div>
          </form>
        )}

        {activeTab === 'orders' && (
          <div className="space-y-6">
            {orders.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                Você ainda não tem nenhum pedido.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Evento
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Data
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Taxa
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {orders.map((order) => (
                      <tr key={order.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {order.event_title}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(order.event_date).toLocaleDateString('pt-BR')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(order.platform_fee)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(order.total_price)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            order.status === 'paid'
                              ? 'bg-green-100 text-green-800'
                              : order.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {order.status === 'paid' ? 'Pago' :
                             order.status === 'pending' ? 'Pendente' :
                             order.status === 'canceled' ? 'Cancelado' :
                             order.status === 'refunded' ? 'Reembolsado' : order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="p-6 border-t bg-gray-50">
        <div className="flex justify-between items-center">
          <button
            onClick={logout}
            className="text-sm font-medium text-red-600 hover:text-red-700 focus:outline-none focus:underline"
          >
            Sair da conta
          </button>
        </div>
      </div>
    </>
  );
}

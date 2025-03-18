import { Event, Category, State, City } from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Token management functions
const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

const getRefreshToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('refreshToken');
  }
  return null;
};

const setTokens = (accessToken: string, refreshToken: string) => {
  localStorage.setItem('token', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
};

const clearTokens = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
};

// Helper function to validate token
const isTokenValid = (token: string | null): boolean => {
  if (!token) return false;
  
  try {
    const [, payload] = token.split('.');
    if (!payload) return false;

    const decodedPayload = JSON.parse(atob(payload));
    const expirationTime = decodedPayload.exp * 1000;
    
    // Considerar o token inválido se estiver a menos de 5 minutos de expirar
    return Date.now() < (expirationTime - 5 * 60 * 1000);
  } catch {
    return false;
  }
};

// Refresh token function
const refreshAccessToken = async () => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/token/refresh/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    if (!response.ok) {
      throw new Error('Failed to refresh token');
    }

    const data = await response.json();
    setTokens(data.access, data.refresh || refreshToken);
    return data.access;
  } catch (error) {
    clearTokens();
    throw error;
  }
};

// Helper function to create headers with authentication
const createAuthHeaders = async (): Promise<Record<string, string>> => {
  let token = getAuthToken();

  if (!token || !isTokenValid(token)) {
    try {
      token = await refreshAccessToken();
    } catch (error) {
      throw new Error('Session expired');
    }
  }
  
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
};

// Authentication
export async function login(username: string, password: string) {
  const response = await fetch(`${API_BASE_URL}/login/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Login failed');
  }

  return response.json();
}


export async function register(username: string, email: string, password: string) {
  const response = await fetch(`${API_BASE_URL}/register/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, email, password }),
  });

  if (!response.ok) {
    throw new Error('Registration failed');
  }

  return response.json();
}

// User Profile
export async function getUserProfile() {
  try {
    const headers = await createAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/user/profile/`, {
      method: 'GET',
      headers: headers
    });

    if (response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      throw new Error('Session expired');
    }

    if (!response.ok) {
      throw new Error('Failed to fetch user profile');
    }

    return response.json();
  } catch (error) {
    if (error instanceof Error && error.message === 'Invalid or expired token') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      throw new Error('Session expired');
    }
    throw error;
  }
}

export async function updateUserProfile(data: any) {
  try {
    const headers = await createAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/user/profile/`, {
      method: 'PATCH',
      headers: headers,
      body: JSON.stringify(data),
    });

    const responseData = await response.json();

    if (!response.ok) {
      // Se houver erros específicos do backend, lance-os
      if (responseData.profile?.cpf) {
        throw { response: { data: responseData } };
      }
      throw new Error('Failed to update user profile');
    }

    return responseData;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to update user profile');
  }
}

// Orders
export async function getUserOrders() {
  try {
    const headers = await createAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/user/orders/`, {
      method: 'GET',
      headers: headers
    });

    if (response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      throw new Error('Session expired');
    }

    if (!response.ok) {
      throw new Error('Failed to fetch user orders');
    }

    return response.json();
  } catch (error) {
    if (error instanceof Error && error.message === 'Invalid or expired token') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      throw new Error('Session expired');
    }
    throw error;
  }
}

// Events
export async function getEvents(): Promise<Event[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/events/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch events');
    }

    return response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to fetch events');
  }
}

export async function getCategories(): Promise<Category[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/categories/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }

    return response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to fetch categories');
  }
}

// Location APIs
export async function getStates(): Promise<State[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/states/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch states');
    }

    return response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to fetch states');
  }
}

export async function getCities(stateId: number): Promise<City[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/cities/?state=${stateId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch cities');
    }

    return response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to fetch cities');
  }
}

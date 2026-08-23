export const API_URL = 'http://localhost:5000/api';

export const fetchApi = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('token');
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();
  
  if (!response.ok) {
    if (response.status === 401) {
      const { authEventTarget } = await import('../context/AuthContext');
      authEventTarget.dispatchEvent(new Event('logout'));
    }
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
};

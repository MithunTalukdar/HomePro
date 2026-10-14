const rawBase = (import.meta.env.VITE_API_URL as string | undefined) || '';
const BASE_URL = rawBase.replace(/\/$/, '');
export const API_URL = BASE_URL ? `${BASE_URL}/api` : '/api';

export interface ApiError extends Error {
  status?: number;
  field?: string;
  data?: any;
}

export const fetchApi = async (endpoint: string, options: RequestInit = {}): Promise<any> => {
  const token = localStorage.getItem('token');
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  let response: Response;
  try {
    response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });
  } catch (networkError: any) {
    const error: ApiError = new Error(
      networkError.message?.includes('Failed to fetch')
        ? 'Unable to connect to server. Please check your internet connection and verify the backend is running.'
        : networkError.message || 'Network request failed'
    );
    error.status = 0;
    throw error;
  }

  let data: any = null;
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    try {
      data = await response.json();
    } catch {
      data = { message: 'Failed to parse server response' };
    }
  } else {
    const text = await response.text();
    data = { message: text || response.statusText };
  }
  
  if (!response.ok) {
    if (response.status === 401) {
      try {
        const { authEventTarget } = await import('../context/AuthContext');
        authEventTarget.dispatchEvent(new Event('logout'));
      } catch {
        // Safe fallback
      }
    }
    const error: ApiError = new Error(data.message || 'Something went wrong');
    error.status = response.status;
    error.field = data.field;
    error.data = data;
    throw error;
  }

  return data;
};

import { useAuth } from '@clerk/clerk-react';

export const useApiRequest = () => {
  const { getToken } = useAuth();

  const makeRequest = async (endpoint: string, options: RequestInit = {}) => {
    try {
      const token = await getToken();
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  };

  const get = (endpoint: string) => makeRequest(endpoint, { method: 'GET' });
  
  const post = (endpoint: string, data?: any) => 
    makeRequest(endpoint, { 
      method: 'POST', 
      body: data ? JSON.stringify(data) : undefined 
    });
  
  const put = (endpoint: string, data?: any) => 
    makeRequest(endpoint, { 
      method: 'PUT', 
      body: data ? JSON.stringify(data) : undefined 
    });
  
  const del = (endpoint: string) => makeRequest(endpoint, { method: 'DELETE' });

  return { makeRequest, get, post, put, delete: del };
};

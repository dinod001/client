import { useAuth } from '@clerk/clerk-react';

// API Service interface matching the actual response
interface ApiService {
  _id: string;
  serviceName: string;
  description: string;
  price: number;
  discount: number;
  imageUrl: string;
  Availability: boolean;
  __v: number;
}

interface ServicesResponse {
  success: boolean;
  data: ApiService[];
}

export const useServicesApi = () => {
  const { getToken, isSignedIn } = useAuth();

  const getAllServices = async (): Promise<ServicesResponse> => {
    try {
      // For public services, we may not need authentication
      // Try without token first, then with token if available
      let headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (isSignedIn) {
        try {
          const token = await getToken();
          if (token) {
            headers['Authorization'] = `Bearer ${token}`;
          }
        } catch (authError) {
          console.warn('Authentication token unavailable, proceeding without auth:', authError);
        }
      }

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/personnel/get-all-services`, {
        method: 'GET',
        // Remove credentials: 'include' to avoid CORS wildcard issue
        headers,
      });

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error('Access denied - CORS policy violation');
        }
        if (response.status === 401) {
          throw new Error('Authentication required');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ServicesResponse = await response.json();
      return data;
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('CORS')) {
        console.error('CORS Error: Request blocked by browser security policy');
        throw new Error('Security policy prevented this request. Please use the official application.');
      }
      console.error('Failed to fetch services:', error);
      throw error;
    }
  };

  return { getAllServices };
};

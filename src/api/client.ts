import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import toast from 'react-hot-toast';

// Extend InternalAxiosRequestConfig to include metadata
declare module 'axios' {
  export interface InternalAxiosRequestConfig {
    metadata?: {
      startTime: number;
    };
  }
}

// Define environment type
declare global {
  interface ImportMeta {
    env: {
      DEV: boolean;
      VITE_API_URL?: string;
      VITE_APP_NAME?: string;
    };
  }
}

export interface ApiErrorResponse {
  message?: string;
  detail?: {
    message: string;
    error_code: string;
  };
  errors?: Record<string, string>;
  error_code?: string;
}

export interface ApiError extends AxiosError<ApiErrorResponse> {}

const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const startTime = new Date().getTime();
    config.metadata = { startTime };
    
    // Log API calls in development - using optional chaining to avoid errors
    if (import.meta.env.DEV) {
      console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`, config.data);
    }
    
    return config;
  },
  (error: AxiosError) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log response time in development
    if (import.meta.env.DEV && response.config.metadata) {
      const endTime = new Date().getTime();
      const duration = endTime - (response.config.metadata?.startTime || endTime);
      console.log(`API Response: ${response.config.method?.toUpperCase()} ${response.config.url} - ${duration}ms`);
    }
    return response;
  },
  (error: AxiosError) => {
    const apiError = error as ApiError;
    
    // Extract error message
    let errorMessage = 'An unexpected error occurred';
    let errorCode = 'UNKNOWN_ERROR';
    
    if (apiError.response) {
      const status = apiError.response.status;
      const data = apiError.response.data as ApiErrorResponse;
      
      // Handle different error response formats
      if (data.detail) {
        errorMessage = data.detail.message;
        errorCode = data.detail.error_code;
      } else if (data.message) {
        errorMessage = data.message;
        errorCode = data.error_code || 'ERROR';
      } else if (typeof data === 'string') {
        errorMessage = data;
      }
      
      // Log error
      console.error(`❌ API Error ${status}:`, {
        url: apiError.config?.url,
        method: apiError.config?.method,
        status,
        message: errorMessage,
        code: errorCode,
        data: apiError.response.data
      });
      
      // Show toast notification for errors
      if (status >= 400 && status < 500) {
        toast.error(errorMessage);
      } else if (status >= 500) {
        toast.error('Server error. Please try again later.');
      }
    } else if (apiError.request) {
      errorMessage = 'Network error. Please check your connection.';
      errorCode = 'NETWORK_ERROR';
      toast.error(errorMessage);
    } else {
      errorMessage = apiError.message || 'Request failed';
      toast.error(errorMessage);
    }
    
    return Promise.reject(apiError);
  }
);

export default apiClient;
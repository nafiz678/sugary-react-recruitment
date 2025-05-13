
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

// Base URL
const BASE_URL = 'https://sugarytestapi.azurewebsites.net';

const newAxios = axios.create({
  baseURL: BASE_URL
});

// Get tokens from local storage
const getAccessToken = () => localStorage.getItem('accessToken');
const getRefreshToken = () => localStorage.getItem('refreshToken');

// Save tokens to local storage
const saveTokens = (accessToken: string, refreshToken: string, accessExpiry: string, refreshExpiry: string) => {
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
  localStorage.setItem('accessExpiry', accessExpiry);
  localStorage.setItem('refreshExpiry', refreshExpiry);
};

// Remove tokens from storage
const removeTokens = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('accessExpiry');
  localStorage.removeItem('refreshExpiry');
};

// Check if token is expired
const isTokenExpired = (token: string) => {
  if (!token) return true;
  
  try {
    const decoded = jwtDecode(token);
    if(!decoded.exp) return
    return decoded.exp * 1000 < Date.now();
  } catch (error) {
    console.error('Error decoding token:', error);
    return true;
  }
};

// Function to refresh the token
const refreshAuthToken = async () => {
  try {
    const accessToken = getAccessToken();
    const refreshToken = getRefreshToken();
    
    if (!accessToken || !refreshToken) {
      throw new Error('No tokens available');
    }
    
    const response = await axios.post(`${BASE_URL}/Account/RefreshToken`, {
      AccessToken: accessToken,
      RefreshToken: refreshToken
    });
    
    if (response.data) {
      saveTokens(
        response.data.Token,
        response.data.RefreshToken,
        response.data.AccessTokenExpiresAt,
        response.data.RefreshTokenExpiresAt
      );
      return response.data.Token;
    } else {
      throw new Error('Token refresh failed');
    }
  } catch (error) {
    console.error('Error refreshing token:', error);
    removeTokens();
    // Redirect to login or handle auth failure
    window.location.href = '/login';
    throw error;
  }
};

// Request interceptor - adds token to requests
newAxios.interceptors.request.use(
  async (config) => {
    let token = getAccessToken();
    
    // If token exists but is expired, try to refresh it
    if (token && isTokenExpired(token)) {
      try {
        token = await refreshAuthToken();
      } catch (error) {
        // If refresh fails, proceed with request (it will likely fail, but the response interceptor will handle it)
        console.log('Token refresh failed in request interceptor', error);
      }
    }
    
    // Add token to headers if it exists
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handles 401 errors
newAxios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If 401 error and we haven't tried to refresh the token for this request yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Try to refresh the token
        const newToken = await refreshAuthToken();
        
        // Update the Authorization header
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        
        // Retry the original request
        return newAxios(originalRequest);
      } catch (refreshError) {
        // If refresh fails, redirect to login
        removeTokens();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// Function to check if user is authenticated
export const checkAuth = async () => {
  const token = getAccessToken();
  const refreshToken = getRefreshToken();
  
  // If no tokens, user is not authenticated
  if (!token || !refreshToken) {
    return false;
  }
  
  // If token is expired, try to refresh
  if (!token) {
    try {
      await refreshAuthToken();
      return true;
    } catch (error) {
        console.log("Error happens", error)
      return false;
    }
  }
  
  return true;
};

export default newAxios;
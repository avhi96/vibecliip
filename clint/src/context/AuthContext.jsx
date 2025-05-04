import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// ✅ Create the context
const AuthContext = createContext();

// ✅ Export the context to use it in other components
export { AuthContext };

// ✅ Provide the context to children components
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Create axios instance with baseURL and Authorization header if token exists
  const axiosInstance = axios.create({
    baseURL: 'http://localhost:8000/api/v1',
    withCredentials: true,
  });
  axiosInstance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      console.log('Request:', config.method.toUpperCase(), config.url, 'Headers:', config.headers);
      return config;
    },
    (error) => Promise.reject(error)
  );
  
  axiosInstance.interceptors.response.use(
    (response) => {
      console.log('Response:', response.status, response.config.url);
      return response;
    },
    async (error) => {
      const originalRequest = error.config;
      console.log('Response error:', error.response?.status, originalRequest.url);
      if (error.response && error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          console.log('Attempting token refresh...');
          const res = await axios.post('http://localhost:8000/api/v1/auth/refresh-token', {}, { withCredentials: true });
          if (res.data.success) {
            console.log('Token refreshed');
            localStorage.setItem('token', res.data.token);
            axiosInstance.defaults.headers.common['Authorization'] = 'Bearer ' + res.data.token;
            originalRequest.headers['Authorization'] = 'Bearer ' + res.data.token;
            return axiosInstance(originalRequest);
          }
        } catch (refreshError) {
          console.error('Refresh token failed:', refreshError);
          setUser(null);
          localStorage.removeItem('token');
          setLoading(false);
          return Promise.reject(refreshError);
        }
      }
      return Promise.reject(error);
    }
  );
  

  useEffect(() => {
    let isMounted = true;

    const checkUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        if (isMounted) {
          setUser(null);
          setLoading(false);
        }
        return;
      }
      try {
        const res = await axiosInstance.get('/user/me');
        if (isMounted) {
          setUser(res.data.success ? res.data.user : null);
        }
      } catch (error) {
        if (isMounted) {
          console.error('Error fetching user data:', error);
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    checkUser();
    return () => { isMounted = false; };
  }, []);

  const login = (userData, token) => {
    localStorage.setItem('token', token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, axiosInstance }}>
      {children}
    </AuthContext.Provider>
  );
};

// ✅ Export the provider
export { AuthProvider };

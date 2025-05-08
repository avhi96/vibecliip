import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [followStateVersion, setFollowStateVersion] = useState(0);
  const [followedUserIds, setFollowedUserIds] = useState([]);

  const axiosInstance = axios.create({
    baseURL: 'http://localhost:8000/api/v1',  // Changed to local backend URL for local development
    withCredentials: true,
  });

  axiosInstance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      if (error.response && error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          const res = await axios.post('http://localhost:8000/api/v1/auth/refresh-token', {}, { withCredentials: true });
          if (res.data.success) {
            localStorage.setItem('token', res.data.token);
            axiosInstance.defaults.headers.common['Authorization'] = 'Bearer ' + res.data.token;
            originalRequest.headers['Authorization'] = 'Bearer ' + res.data.token;
            return axiosInstance(originalRequest);
          }
        } catch (refreshError) {
          setUser(null);
          setLoading(false);
          localStorage.removeItem('token');
          // Call backend logout API to clear refresh token cookie
          await axios.get('http://localhost:8000/api/v1/auth/logout', { withCredentials: true });
          window.location.href = '/login';
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
          setFollowedUserIds([]);
        }
        return;
      }
      try {
        const res = await axiosInstance.get('/user/me');
        if (isMounted) {
          const newUser = res.data.success ? res.data.user : null;
          setUser(newUser);
          setFollowedUserIds(newUser?.following?.map(f => f._id) || []);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        if (isMounted) {
          setUser(null);
          setFollowedUserIds([]);
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

  const updateUser = (newUser) => {
    setUser(newUser);
    setFollowedUserIds(newUser?.following?.map(f => f._id) || []);
    setFollowStateVersion(prev => prev + 1);
  };

  const addFollowedUserId = (userId) => {
    setFollowedUserIds(prev => {
      if (!prev.includes(userId)) {
        return [...prev, userId];
      }
      return prev;
    });
    setFollowStateVersion(prev => prev + 1);
  };

  const removeFollowedUserId = (userId) => {
    setFollowedUserIds(prev => prev.filter(id => id !== userId));
    setFollowStateVersion(prev => prev + 1);
  };

  const login = (userData, token) => {
    localStorage.setItem('token', token);
    updateUser(userData);
  };

  const logout = async () => {
    localStorage.removeItem('token');
    setUser(null);
    setFollowedUserIds([]);
    // Call backend logout API to clear refresh token cookie
    await axios.get('http://localhost:8000/api/v1/auth/logout', { withCredentials: true });
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      logout,
      axiosInstance,
      followStateVersion,
      updateUser,
      followedUserIds,
      addFollowedUserId,
      removeFollowedUserId
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };

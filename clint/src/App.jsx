import React, { useContext } from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider, AuthContext } from './context/AuthContext';

import Login from './components/login';
import Register from './components/Register';
import Home from './components/Home';
import MainLayout from './components/MainLayout';
import Profile from './components/Profile';
import NotFound from './components/NotFound'; // 👈 Import it

const RequireAuth = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const browserRouter = createBrowserRouter([
  {
    path: '/',
    element: (
      <RequireAuth>
        <MainLayout />
      </RequireAuth>
    ),
    errorElement: <NotFound />, 
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/profile',
        element: <Profile />,
      },
    ],
  },
  {
    path: '/login',
    element: <Login />,
    errorElement: <NotFound />, 
  },
  {
    path: '/register',
    element: <Register />,
    errorElement: <NotFound />, 
  },
  {
    path: '*', // catch-all for any unmatched routes
    element: <NotFound />,
  },
]);

const App = () => {
  return (
    <AuthProvider>
      <RouterProvider router={browserRouter} />
      <ToastContainer 
        position="bottom-right" 
        autoClose={3000} 
        hideProgressBar={false} 
        newestOnTop={false}
        closeOnClick
        rtl={false}
        draggable
        theme="dark"
      />
    </AuthProvider>
  );
};

export default App;

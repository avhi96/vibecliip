import React, { useContext } from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider, AuthContext } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { PostModalProvider } from './context/PostModalContext';
import { PostsProvider } from './context/PostsContext';

import Login from './pages/login';
import Register from './pages/register';
import Home from './pages/Home';
import MainLayout from './components/MainLayout';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import NotFound from './components/NotFound';
import Post from './components/post';
import ForgetPassword from './components/ForgetPassword';
import ResetPassword from './pages/ResetPassword';
import Search from './pages/Search';
import Messages from './components/Messages';
import CreatePost from './pages/CreatePost';

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
      { index: true, element: <Home /> },
      { path: 'profile/:userId', element: <Profile /> },
      { path: 'profile', element: <Profile /> },
      { path: 'messages', element: <Messages /> },
      { path: 'settings', element: <Settings /> },
      { path: 'post', element: <Post /> },
      { path: 'search', element: <Search /> },
      { path: 'create-post', element: <CreatePost /> }
    ]
  },
  { path: '/login', element: <Login />, errorElement: <NotFound /> },
  { path: '/register', element: <Register />, errorElement: <NotFound /> },
  { path: '/forget-password', element: <ForgetPassword />, errorElement: <NotFound /> },
  { path: '/reset-password/:token', element: <ResetPassword />, errorElement: <NotFound /> },
  { path: '*', element: <NotFound /> }
]);

const App = () => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <PostModalProvider>
          <PostsProvider>
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
          </PostsProvider>
        </PostModalProvider>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;

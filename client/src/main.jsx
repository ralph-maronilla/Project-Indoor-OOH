import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ReactDOM from 'react-dom/client';
import './index.css';

import App from './App.jsx';
import ErrorPage from './pages/ErrorPage.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Media from './pages/Media.jsx';
import Home from './pages/Home.jsx';
import Admin from './pages/Admin.jsx';
import ProtectedRoute from './components/navigation/ProtectedRoute.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/',
        element: (
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        ),
        errorElement: <ErrorPage />,
      },
      {
        path: '/media',
        element: (
          <ProtectedRoute>
            <Media />
          </ProtectedRoute>
        ),
        errorElement: <ErrorPage />,
      },
      {
        path: '/admin',
        element: (
          <ProtectedRoute allowedRoles={['admin']}>
            <Admin />
          </ProtectedRoute>
        ),
        errorElement: <ErrorPage />,
      },
    ],
  },
  {
    path: '/login',
    element: <Login />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/register',
    element: <Register />,
    errorElement: <ErrorPage />,
  },
]);

const root = document.getElementById('root');
ReactDOM.createRoot(root).render(<RouterProvider router={router} />);

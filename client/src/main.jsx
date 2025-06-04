import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ReactDOM from 'react-dom/client';
import './index.css';

import App from './App.jsx';
import ErrorPage from './pages/ErrorPage.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    // children: [
    //   {
    //     path: '/login',
    //     element: <Login />,
    //     errorElement: <ErrorPage />,
    //   },
    //   {
    //     path: '/register',
    //     element: <Register />,
    //     errorElement: <ErrorPage />,
    //   },
    // ],
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

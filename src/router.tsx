// src/router.tsx
import { Navigate, createHashRouter } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';
import { Home } from './pages/Home';
import { Music } from './pages/Music';
import { Shows } from './pages/Shows';
import { Media } from './pages/Media';
import { Contact } from './pages/Contact';
import { Epk } from './pages/Epk';
import { AdminLayout, RequireAuth } from './pages/admin/AdminLayout';
import { AdminLogin } from './pages/admin/AdminLogin';
import { Dashboard } from './pages/admin/Dashboard';

export const router = createHashRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'musica', element: <Music /> },
      { path: 'shows', element: <Shows /> },
      { path: 'media', element: <Media /> },
      { path: 'contacto', element: <Contact /> },
      { path: 'epk', element: <Epk /> },
    ],
  },
  {
    path: '/admin',
    children: [
      { path: 'login', element: <AdminLogin /> },
      {
        element: <RequireAuth />,
        children: [
          {
            element: <AdminLayout />,
            children: [
              { index: true, element: <Navigate to="dashboard" replace /> },
              { path: 'dashboard', element: <Dashboard /> },
            ],
          },
        ],
      },
    ],
  },
]);

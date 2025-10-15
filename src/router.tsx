// src/router.tsx
import { createHashRouter } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';
import { Home } from './pages/Home';
import { Music } from './pages/Music';
import { Shows } from './pages/Shows';
import { Media } from './pages/Media';
import { Contact } from './pages/Contact';
import { Epk } from './pages/Epk';

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
]);

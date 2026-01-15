import { createBrowserRouter } from 'react-router-dom'
import Layout from '@/components/Layout'
import HomePage from '@/pages/HomePage'
import AboutPage from '@/pages/AboutPage'
import ServicesPage from '@/pages/ServicesPage'
import MapPage from '@/pages/MapPage'
import AccountPage from '@/pages/AccountPage'
import ImpressumPage from '@/pages/ImpressumPage'
import DatenschutzPage from '@/pages/DatenschutzPage'
import KontaktPage from '@/pages/KontaktPage'
import { ProtectedRoute } from '@/auth/ProtectedRoute'

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <HomePage />,
      },
      {
        path: '/about',
        element: <AboutPage />,
      },
      {
        path: '/services',
        element: (
          <ProtectedRoute>
            <ServicesPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/map',
        element: <MapPage />,
      },
      {
        path: '/account',
        element: (
          <ProtectedRoute>
            <AccountPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/impressum',
        element: <ImpressumPage />,
      },
      {
        path: '/datenschutz',
        element: <DatenschutzPage />,
      },
      {
        path: '/contact',
        element: <KontaktPage />,
      },
    ],
  },
])

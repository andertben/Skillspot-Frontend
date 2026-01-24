import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { I18nextProvider } from 'react-i18next'
import i18n from '@/i18n/i18n'

// Pages
import AboutPage from '@/pages/AboutPage'
import ImpressumPage from '@/pages/ImpressumPage'
import DatenschutzPage from '@/pages/DatenschutzPage'
import KontaktPage from '@/pages/KontaktPage'
import ChatPage from '@/pages/ChatPage'

// Mocking dependencies that might cause issues in jsdom or need API
vi.mock('lucide-react', async (importOriginal) => {
  const actual = await importOriginal<typeof import('lucide-react')>()
  return new Proxy(actual, {
    get: (target, prop) => {
      if (typeof prop === 'string' && prop[0] === prop[0].toUpperCase()) {
        return () => <div data-testid={`${prop.toLowerCase()}-icon`} />
      }
      return Reflect.get(target, prop)
    },
  })
})

// Mock scrollTo as it is not implemented in jsdom
Element.prototype.scrollTo = vi.fn()

vi.mock('@auth0/auth0-react', () => ({
  useAuth0: () => ({
    isAuthenticated: true,
    user: { sub: 'user_123', name: 'Test User' },
    isLoading: false,
  }),
  Auth0Provider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

vi.mock('@/auth/useOptionalAuth', () => ({
  useOptionalAuth: () => ({
    isAuthenticated: true,
    user: { sub: 'user_123', name: 'Test User' },
    isLoading: false,
    loginWithPopup: vi.fn(),
    loginWithRedirect: vi.fn(),
    logout: vi.fn(),
    getAccessTokenSilently: vi.fn(),
    isAuthAvailable: true,
  }),
}))

vi.mock('@/api/chat', () => ({
  getMessages: vi.fn(() => Promise.resolve([])),
  sendMessage: vi.fn(),
  getThread: vi.fn(() => Promise.resolve({ threadId: '1', anbieterName: 'Test Provider', dienstleistungTitle: 'Test Service' })),
  markThreadRead: vi.fn(() => Promise.resolve()),
}))

// Mock Recharts as it uses SVG and can fail in jsdom
vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: any) => <div data-testid="recharts-container">{children}</div>,
  LineChart: () => <div data-testid="line-chart" />,
  Line: () => null,
  XAxis: () => null,
  YAxis: () => null,
  CartesianGrid: () => null,
  Tooltip: () => null,
  Legend: () => null,
}))

// Mock Leaflet
vi.mock('react-leaflet', () => ({
  MapContainer: ({ children }: any) => <div data-testid="map-container">{children}</div>,
  TileLayer: () => null,
  Marker: ({ children }: any) => <div data-testid="marker">{children}</div>,
  Popup: ({ children }: any) => <div data-testid="popup">{children}</div>,
}))

describe('Smoke Tests', () => {
  beforeEach(() => {
    i18n.changeLanguage('de')
  })

  describe('Routing Smoke', () => {
    it('renders AboutPage with correct title', () => {
      render(
        <I18nextProvider i18n={i18n}>
          <MemoryRouter>
            <AboutPage />
          </MemoryRouter>
        </I18nextProvider>
      )
      expect(screen.getByText(i18n.t('pages.about.title'))).toBeInTheDocument()
    })

    it('renders ImpressumPage with correct title', () => {
      render(
        <I18nextProvider i18n={i18n}>
          <MemoryRouter>
            <ImpressumPage />
          </MemoryRouter>
        </I18nextProvider>
      )
      expect(screen.getByText(i18n.t('imprint.title'))).toBeInTheDocument()
    })

    it('renders DatenschutzPage with correct title', () => {
      render(
        <I18nextProvider i18n={i18n}>
          <MemoryRouter>
            <DatenschutzPage />
          </MemoryRouter>
        </I18nextProvider>
      )
      expect(screen.getByText(i18n.t('privacy.title'))).toBeInTheDocument()
    })

    it('renders KontaktPage with correct title', () => {
      render(
        <I18nextProvider i18n={i18n}>
          <MemoryRouter>
            <KontaktPage />
          </MemoryRouter>
        </I18nextProvider>
      )
      expect(screen.getByText(i18n.t('footer.contact'))).toBeInTheDocument()
    })
  })

  describe('i18n Smoke', () => {
    it('shows English text when language is set to en', async () => {
      await i18n.changeLanguage('en')
      render(
        <I18nextProvider i18n={i18n}>
          <MemoryRouter>
            <AboutPage />
          </MemoryRouter>
        </I18nextProvider>
      )
      // "About Us" is the English title for about page
      expect(screen.getByText('About Us')).toBeInTheDocument()
      expect(screen.queryByText('Über uns')).not.toBeInTheDocument()
    })
  })

  describe('Chat UI Alignment Smoke', () => {
    it('aligns own messages to the right and others to the left', async () => {
      const { getMessages } = await import('@/api/chat')
      const mockMessages = [
        {
          id: '1',
          threadId: 'thread_1',
          senderId: 'user_123', // Own message (matches mocked user.sub)
          text: 'Hello from me',
          timestamp: new Date().toISOString(),
        },
        {
          id: '2',
          threadId: 'thread_1',
          senderId: 'other_456', // Other message
          text: 'Hello from someone else',
          timestamp: new Date().toISOString(),
        },
      ]
      
      vi.mocked(getMessages).mockResolvedValue(mockMessages)

      render(
        <I18nextProvider i18n={i18n}>
          <MemoryRouter initialEntries={['/chat/thread_1']}>
            <Routes>
              <Route path="/chat/:threadId" element={<ChatPage />} />
            </Routes>
          </MemoryRouter>
        </I18nextProvider>
      )

      // Wait for messages to load
      const ownMessageText = await screen.findByText('Hello from me')
      const otherMessageText = await screen.findByText('Hello from someone else')

      // Check alignment by classes
      // Wrapper for own message should have justify-end
      const ownMessageWrapper = ownMessageText.closest('.w-full.flex')
      expect(ownMessageWrapper).toHaveClass('justify-end')

      // Wrapper for other message should have justify-start
      const otherMessageWrapper = otherMessageText.closest('.w-full.flex')
      expect(otherMessageWrapper).toHaveClass('justify-start')
    })
  })
})

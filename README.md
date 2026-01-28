# Skillspot Frontend

Frontend der Skillspot Plattform (React + Vite + TypeScript) fuer Services, Anbieter, Map, Chat und Profilverwaltung.

## Schnellstart

1. Abhaengigkeiten installieren
   - `npm ci` (empfohlen) oder `npm install`
2. Lokale Umgebungsvariablen anlegen
   - `.env.local` erstellen (Beispiel unten)
3. Dev-Server starten
   - `npm run dev`
4. App oeffnen
   - Standard: `http://localhost:5173`

## Konfiguration (ENV)

Vite liest Variablen aus `.env*` Dateien. Relevante Keys:

```
VITE_API_URL=http://localhost:8080
VITE_AUTH0_DOMAIN=your-tenant.eu.auth0.com
VITE_AUTH0_CLIENT_ID=your-client-id
VITE_AUTH0_AUDIENCE=optional-api-audience
VITE_AUTH0_REDIRECT_URI=http://localhost:5173
VITE_APP_NAME=Skillspot
```

Hinweise:
- Wenn `VITE_AUTH0_DOMAIN` und `VITE_AUTH0_CLIENT_ID` fehlen, laeuft die App ohne Auth0 (Protected Routes zeigen eine Meldung).
- `VITE_AUTH0_REDIRECT_URI` faellt sonst auf `window.location.origin` zurueck.
- `VITE_API_URL` ist in Production verpflichtend, sonst wird ein Warn-Log ausgegeben.

## Scripts

- `npm run dev` - lokaler Dev-Server
- `npm run build` - TypeScript Build + Vite Build
- `npm run preview` - lokales Preview des Builds
- `npm run lint` - ESLint
- `npm run test` - Vitest (headless)
- `npm run test:watch` - Vitest Watch
- `npm run test:ui` - Vitest UI

## Architektur Ueberblick

- Einstieg: `src/main.tsx` -> `src/App.tsx` -> `src/router.tsx`
- Routing: `react-router-dom` mit Layout-Wrapper und geschuetzten Routen
- Layout: `src/components/Layout.tsx` (Navigation, Language Switch, Theme Toggle, Login Modal, Unread Badge)
- Auth:
  - `src/auth/useOptionalAuth.ts` kapselt Auth0 optional
  - `src/auth/SetupAuthInterceptor.tsx` haengt Bearer Token an Axios
  - `src/auth/ProtectedRoute.tsx` sperrt Routen bis Auth + Profil vorhanden
- Profilfluss:
  - `src/components/ProfileGate.tsx` laedt `/me` nach Login und zeigt Profil-Modal
  - Zustand Store: `src/hooks/useUserStore.ts`
- I18n: `src/i18n/i18n.ts` mit `de` und `en`, Sprache wird in `localStorage` gespeichert

## Ordnerstruktur (Auswahl)

- `src/api/` - API Calls (Axios)
- `src/auth/` - Auth0 Integration
- `src/components/` - UI/Layouts/Widgets
- `src/pages/` - Route Views
- `src/hooks/` - Custom Hooks
- `src/types/` - Typen/DTOs
- `src/i18n/` - Lokalisierung
- `src/assets/` - statische Assets (Leaflet Marker etc.)

## API Layer

Base Client: `src/api/client.ts`
- `Accept-Language` wird aus i18n gesetzt
- Base URL: `VITE_API_URL` (Fallback: `http://localhost:8080`)
- Fehlerlogging fuer 401/403 in DEV

Endpoints (Auszug):
- Services: `src/api/services.ts`
  - `GET /kategorien/tree`
  - `GET /dienstleistungen`
  - `GET /dienstleistungen/:id`
  - `GET /dienstleistungen/my`
  - `POST /dienstleistungen`
  - `PUT /dienstleistungen/:id`
  - `DELETE /dienstleistungen/:id`
- Kategorien: `src/api/categories.ts`
  - `GET /kategorien`
- Anbieter: `src/api/providers.ts`
  - `GET /anbieter`
- Reviews: `src/api/reviews.ts`
  - `GET /api/reviews/service/:id`
  - `GET /api/reviews/average/:id`
  - `GET /api/reviews/provider/:id`
  - `POST /bewertungen`
- User: `src/api/user.ts`
  - `GET /me`
  - `POST /me/complete-profile`
  - `PUT /me/profile`
- Chat: `src/api/chat.ts`
  - `POST /chat/threads`
  - `GET /chat/threads`
  - `GET /chat/unread-count`
  - `POST /chat/threads/:id/read`
  - `GET /chat/threads/:id`
  - `GET /chat/threads/:id/messages`
  - `POST /chat/threads/:id/messages`
- Routing: `src/api/routing.ts`
  - OSRM Public Demo (`https://router.project-osrm.org`)

## Styling

- Tailwind CSS v4 (siehe `tailwind.config.ts`, `postcss.config.js`)
- UI Komponenten unter `src/components/ui/` (shadcn Basis)
- Themes via `useTheme` und Root-Klassen `light`/`dark`

## Tests

Vitest Setup:
- `src/test/setup.ts` (Testing Library + JSDOM)
- Beispieltest: `src/__tests__/smoke.test.tsx`

## Docker Build

Der Dockerfile baut mit Vite und liefert via nginx aus.

Beispiel:
```
docker build \
  --build-arg VITE_API_URL=http://localhost:8080 \
  --build-arg VITE_AUTH0_DOMAIN=your-tenant.eu.auth0.com \
  --build-arg VITE_AUTH0_CLIENT_ID=your-client-id \
  --build-arg VITE_AUTH0_AUDIENCE=optional-api-audience \
  --build-arg VITE_AUTH0_REDIRECT_URI=https://your-domain.tld \
  -t skillspot-frontend .

docker run -p 8080:80 skillspot-frontend
```

## Erweiterung / Aenderungen

- Neue Seite:
  - Page in `src/pages/` anlegen
  - Route in `src/router.tsx` registrieren
  - Optional Menu-Item in `src/components/Layout.tsx` ergaenzen
- Neue API:
  - Datei in `src/api/` anlegen
  - Types in `src/types/` definieren
- Neue Sprache:
  - JSON in `src/i18n/locales/` ergaenzen
  - `src/i18n/i18n.ts` Resources erweitern

## Troubleshooting

- Protected Routes zeigen nur "not configured": Auth0 ENV fehlt.
- Profil-Modal bleibt offen: `/me` oder `profileComplete` pruefen.
- 401/403: Token-Anhaengung ueber `SetupAuthInterceptor` und Auth0 Audience pruefen.
- Reviews/Chat returnieren leere Werte: Backend-Endpunkte oder CORS pruefen.

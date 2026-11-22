# Kitisuru SDA Church: website

React 19 + Vite + Tailwind front end for the church website. It talks to the Django API in `Kitisuru_SDA_backend`.

## Setup

```bash
npm install
npm run dev        # http://localhost:5173 (expects the API on http://127.0.0.1:8000)
npm test           # unit tests
npm run lint
npm run build      # production build into dist/
```

## Configuration

The API address is read from `VITE_API_BASE_URL` (see `.env.example`). Without it, development uses
`http://127.0.0.1:8000` and production builds use `https://api.kitisurusda.org`.

Netlify settings are in `netlify.toml`.

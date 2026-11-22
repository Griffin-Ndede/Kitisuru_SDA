# Kitisuru SDA Church: website

React 19 + Vite + Tailwind front end for the Kitisuru SDA Church website. It talks to the Django API in the separate `Kitisuru_SDA_backend` repository.

## Contents

- [Setup](#setup)
- [Configuration](#configuration)
- [Pages and routes](#pages-and-routes)
- [How pages get their data](#how-pages-get-their-data)
- [Project layout](#project-layout)
- [Deployment](#deployment)
- [Known issues](#known-issues)
- [Roadmap](#roadmap)
- [Changelog](#changelog)

## Setup

Requires Node 20 or newer, and the backend running for pages that load data (see the backend README).

```bash
npm install
npm run dev        # http://localhost:5173, expects the API on http://127.0.0.1:8000
npm test           # unit tests (Vitest)
npm run lint       # ESLint
npm run build      # production build into dist/
npm run preview    # serve the production build locally
```

## Configuration

| Variable | Purpose | Default |
|---|---|---|
| `VITE_API_BASE_URL` | API address, no trailing slash | `http://127.0.0.1:8000` in development, `https://api.kitisurusda.org` in production builds |

Copy `.env.example` to `.env.local` to override. `.env` files are not committed.

## Pages and routes

| Route | Page | Data |
|---|---|---|
| `/` | Home: hero, upcoming events, YouTube sermons | events and sermon links from the API |
| `/about` | About | static |
| `/ministries` | Ministries list | API |
| `/ministries/:id` | Ministry detail with programs, contacts and gallery | API |
| `/resources` | Document library with PDF viewer | API (loader) |
| `/giving` | Giving options and M-Pesa paybill details | static |
| `/getinvolved` | Ways to get involved, with a form that sends email | EmailJS |
| `/contact` | Contact details and social links | static |

## How pages get their data

```
Api/  ->  Loaders/loaders.js  ->  Pages/*        ->  Components/*
how to    what each page needs    useLoaderData()    receive props,
call the  (runs before render)                       never fetch
backend
```

- **`src/Api/client.js`** is the one HTTP client: base URL from config and a 10 second timeout.
- **`src/Api/index.js`** lists every endpoint the site reads as a small named function (`getMinistries()`, `getMinistry(id)`, ...). No UI logic, no try/catch.
- **`src/Loaders/loaders.js`** has one loader per route that needs data. Independent requests run in parallel. Loaders do not catch errors; the only translation is an API 404 for a missing ministry, which becomes a 404 response.
- **Pages** read their data with `useLoaderData()` and only display it. There is no loading or error state inside pages.
- **Components** get data as props and do not fetch.
- **`src/Pages/ErrorPage.jsx`** is the root route's `errorElement`. It shows "We couldn't find that page" for 404s and unknown addresses, and "This page didn't load" (with Try again) when the API cannot be reached. Both offer Home and Contact.

To add a page that needs data: add the endpoint to `Api/index.js`, add a loader in `Loaders/loaders.js`, attach it to the route in `App.jsx`, and read it with `useLoaderData()`.

## Project layout

```
src/
  Api/          client.js (HTTP client) and index.js (all endpoints)
  Components/   Navbar, Footer
  Loaders/      loaders.js (one loader per data route)
  Pages/        one file per route, plus ErrorPage
  forms/        activity form and its validation schema
  config.jsx    API base URL
  __tests__/    unit tests
```

## Deployment

Built for Netlify (`netlify.toml`): `npm run build`, publish `dist/`, and every path falls back to `index.html` for client-side routing.

For another static host, build with `VITE_API_BASE_URL=https://your-api-host npm run build`, upload `dist/`, and configure the host to serve `index.html` for unknown paths. Add the site's origin to the backend's `CORS_ALLOWED_ORIGINS`.

## Known issues

- The production bundle is large (about 640 kB) because everything loads at once; route-level code splitting would help.
- Lint reports two unused-variable warnings (`value` in `Giving.jsx`, `motion` in `Home.jsx`). They belong to commented-out or unfinished code.
- Several installed packages are not clearly used yet (`react-pageflip`, `react-pdf`, `@react-pdf/renderer`, `react-full-screen`).

## Roadmap

0. Housekeeping (done)
1. Accounts and sign-in (login, password reset, role-aware portal under `/app`)
2. Member register and clusters (admin screens)
3. Role-based dashboards
4. Hymnal
5. Light features: attendance, announcements, birthdays, visitor follow-up, notifications, giving records

## Changelog

Newest first. Update this section with every significant change.

### 2026-11-22: Data fetching cleanup
- One HTTP client (with a 10 second timeout) and one API module replace four separate endpoint files.
- Loaders live in one file. They no longer swallow errors: the home page used to show empty lists and the ministries page returned nothing when the API failed.
- The Resources page now loads its documents through a loader instead of fetching inside the page, and lost its own loading and error screens.
- Added an error page as the router's `errorElement`: a friendly 404, and a "didn't load" screen with Try again. An unknown ministry id now shows the 404 page.
- The router is created once outside the component, and routes are nested under the root route.
- Added 6 loader tests (9 in total) and a "How pages get their data" section.

### 2026-11-22: Phase 0 housekeeping
- The API address now comes from `VITE_API_BASE_URL`, with development and production defaults (previously hardcoded and switched by editing comments).
- Enabled the ESLint config that had been commented out.
- Fixed a React hook that was called after an early return in `MinistriesDetails.jsx`; removed an unused import.
- Added Vitest with 3 tests, `.env.example`, `.gitignore` entries and this README.

### 2026-11-22: Dependency updates
- Refreshed the lockfile to the newest versions within the existing ranges (React 19.3, Vite 6.4, axios 1.21, Tailwind 4.3, react-router 7.18). `npm audit` reports no vulnerabilities.

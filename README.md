# Kitisuru SDA Church

The website for Kitisuru SDA Church: services and events, sermons, ministries, the church document library and ways to give and get involved. This repository is the website (React + Vite + Tailwind). The backend lives in the `Kitisuru_SDA_backend` repository.

## Running it locally

```bash
npm install
npm run dev        # http://localhost:5173
```

`npm run dev` talks to the backend on your own computer (`http://127.0.0.1:8000`), so start `Kitisuru_SDA_backend` first (see its README). To use the live API instead, without running the backend:

```bash
VITE_API_URL=https://api.kitisurusda.org/ npm run dev
```

`npm run build` always uses the live API (`https://api.kitisurusda.org/`). There are no environment variables to set, and you do not need to edit `src/config.jsx` when switching between the two.

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Build the site into `dist/` |
| `npm run lint` | Check the code (should report zero problems) |
| `npm run preview` | Preview the built site |

## Building and uploading the site

```bash
npm run build
```

The site is built for Netlify (`netlify.toml`): publish `dist/`, and every address falls back to `index.html` so client-side routing works. For another static host, upload `dist/` and configure the host to serve `index.html` for unknown addresses. Add the site's address to `CORS_ALLOWED_ORIGINS` in the backend's `settings.py`.

## Pages

| Address | Page | Data |
| --- | --- | --- |
| `/` | Home: hero, upcoming events, YouTube sermons | API (loader) |
| `/about` | About | static |
| `/ministries` | Ministries list | API (loader) |
| `/ministries/:id` | Ministry detail: programs, contacts, gallery | API (loader) |
| `/resources` | Document library with PDF viewer | API (loader) |
| `/giving` | Giving options and M-Pesa paybill details | static |
| `/getinvolved` | Ways to get involved, with a form that sends email (EmailJS) | static |
| `/contact` | Contact details and social links | static |

## How pages get their data

```
src/Api/client   ->  src/Api/index   ->  src/Loaders/loaders  ->  Pages            ->  Components
how to call the      every backend       what each page needs     read it with         receive props,
backend (one         endpoint as a       (runs BEFORE the page    useLoaderData()      never fetch
HTTP client)         named function      shows)
```

The rules:

1. **Only `src/Api` talks to the backend.** No page or component imports `axios` or builds a URL. To call a new endpoint, add a small function to `src/Api/index.js`.
2. **Loaders fetch, pages display.** Each route that needs data has a loader in `src/Loaders/loaders.js`, wired up in `src/App.jsx`. The page reads the result with `useLoaderData()` and passes it to components as props. Pages do not fetch in `useEffect` and do not keep their own loading or error state.
3. **Loaders do not swallow errors.** A failure is thrown and shown by the single error page (`src/Pages/ErrorPage.jsx`):
   - 404 (an address that does not exist, or a ministry the API does not have) -> "We couldn't find that page"
   - anything else (API down, timeout) -> "This page didn't load", with a Try again button
4. **Requests time out after 10 seconds**, so a hanging API shows the error page instead of freezing navigation.
5. **Refreshing** a page's data means asking the router to run its loader again (`useRevalidator().revalidate()`), not fetching by hand.
6. **Actions the visitor triggers** (the contact and activity forms) are made from the page's event handler, and their errors are shown next to the form.

To add a page that needs data: add the endpoint to `src/Api/index.js`, add a loader in `src/Loaders/loaders.js`, attach it to the route in `src/App.jsx`, and read it with `useLoaderData()`.

## Project layout

```
src/
  Api/          client.js (HTTP client) and index.js (all endpoints)
  Loaders/      loaders.js - one loader per route that needs data
  Components/   shared pieces: Navbar, Footer, the activity form and its schema
  Pages/        one file per route, plus ErrorPage
  App.jsx       the router: every route and its loader
  config.jsx    backend address (local in development, live in production; see the file's comments)
```

## Contributing

Work on a branch, keep pull requests small and focused, and make sure `npm run lint` and `npm run build` pass before opening one. Update this README and add a dated entry to the changelog below after every significant change.

## Changelog

### 2026-11-22: Remove unused files and dependencies

- Deleted `tailwind.config.js` (Tailwind 4 reads `@theme` in `src/index.css`, not this file) and an unused 39 MB background video.
- Removed unused packages: react-pdf, @react-pdf/renderer, react-pageflip, react-full-screen, two Font Awesome icon sets, postcss, @vitejs/plugin-react and the @types packages. Removed leftover template fields from `package.json`.
- Moved the activity form out of the one-off `src/forms/` folder into `src/Components/`.

Newest first.

### 2026-11-22: Match the Bluprint and ShareSpace conventions
- `src/config.jsx` now works like theirs: development uses the local backend (or `VITE_API_URL`), builds always use `https://api.kitisurusda.org/`. The `VITE_API_BASE_URL` variable and `.env.example` are gone.
- The HTTP client, API file and loaders follow the same shape; endpoints are written without a leading slash.
- The error page works out a 404 itself, whether it comes from the router or the API.
- Removed the test setup (Vitest and its files) and `CLAUDE.md`.
- ESLint now uses the same rule set as Bluprint (with the React plugin) and reports zero problems. Cleaned up unused imports and unescaped quotes in page text.

### 2026-11-22: Data fetching cleanup
- One HTTP client (with a 10 second timeout) and one API module replace four separate endpoint files.
- Loaders live in one file and no longer swallow errors: the home page used to show empty lists and the ministries page returned nothing when the API failed.
- The Resources page loads its documents through a loader instead of fetching inside the page.
- Added an error page as the router's `errorElement`: a friendly 404, and a "didn't load" screen with Try again.
- The router is created once outside the component, and routes are nested under the root route.

### 2026-11-22: Housekeeping and dependency updates
- API address no longer hardcoded and switched by editing comments.
- Enabled the ESLint config that had been commented out; fixed a React hook called after an early return in `MinistriesDetails.jsx`.
- Refreshed the lockfile within the existing version ranges; `npm audit` reports no vulnerabilities.

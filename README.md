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

`npm run build` always uses the live API (`https://api.kitisurusda.org/`). You do not need to edit `src/config.jsx` when switching between the two. The only environment variables are the optional Google sign-in keys: copy `.env.example` to `.env` and fill in the `VITE_FIREBASE_*` values from the Firebase console. Without them the "Continue with Google" button is hidden and email sign-in still works. Restart `npm run dev` after editing `.env`.

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
| `/ministries`, `/resources` | Old addresses; they redirect to `/dashboard/ministries` and `/dashboard/library` | none |
| `/giving` | Giving options and M-Pesa paybill details | static |
| `/getinvolved` | Ways to get involved, with a form that sends email (EmailJS) | static |
| `/contact` | Contact details and social links | static |
| `/join` | Create your own account: name, email, phone and password. The shared link in the WhatsApp group (`/join?code=…`) opens the same page | API (action) |
| `/signin` | Sign in with email and password, or Google | API (action) |
| `/forgot-password` | Ask for a password reset email | API (action) |
| `/reset-password` | Choose a password from an invitation or reset link | API (action) |
| `/dashboard` | Dashboard overview, for signed-in people (others go to `/signin`). People who just signed up see a "waiting for approval" message; members see a "complete your profile" reminder. `/app` redirects here | API (loader) |
| `/dashboard/profile` | My profile: members add and edit their name, phone, gender, date of birth and address; download their data; delete their account | API (action) |
| `/dashboard/members` | Admins only: the member register with search and filters; add and edit members, their clusters, role and approval; import (CSV or Excel, with a preview) and export | API (loader + actions) |
| `/dashboard/clusters` | Admins only: create prayer cells and departments and add or remove members | API (loader + actions) |
| `/dashboard/sign-up` | Admins only: the sign-up page address (copy, share on WhatsApp), approve or reject sign-ups, invite one person with a role | API (loader + actions) |
| `/privacy` | How the church uses members' details (read it with the church leadership and adjust it) | static |

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
6. **Actions the visitor triggers** (the contact, activity and sign-in forms) are made from the page's event handler, and their errors are shown next to the form.
7. **Signing in:** the tokens live in `localStorage` (`getSession`, `saveSession` and `clearSession` in `src/Api/client.js`). A request marked `auth: true` sends the token and renews it once automatically if it has expired. `/dashboard` has a loader (`dashboardLoader`) that sends signed-out people to `/signin`; pages inside it read the person with `useRouteLoaderData("dashboard")`. A page only the admin may open gets a 403 from the API, which the error page explains.

To add a page that needs data: add the endpoint to `src/Api/index.js`, add a loader in `src/Loaders/loaders.js`, attach it to the route in `src/App.jsx`, and read it with `useLoaderData()`.

## Project layout

```
src/
  Api/          client.js (HTTP client) and index.js (all endpoints)
  Loaders/      loaders.js - one loader per route that needs data
  Components/   Navbar, Footer, the activity form and its schema. There is no shared UI folder: each page or dialog keeps the small pieces it needs (buttons, fields, modal and so on) at the bottom of its own file
  Context/      ToastContext.jsx - the small "Saved" messages
  Pages/        one file per route, plus ErrorPage; Pages/Dashboard/ holds the signed-in area (layout with sidebar, overview, profile, members, clusters, sign-up)
  firebase.jsx  Google sign-in (loaded only when the button is used)
  App.jsx       the router: every route and its loader
  config.jsx    backend address (local in development, live in production; see the file's comments)
```

## Contributing

Work on a branch, keep pull requests small and focused, and make sure `npm run lint` and `npm run build` pass before opening one. Update this README and add a dated entry to the changelog below after every significant change.

## Dashboard pages

| Address | Who | What |
| --- | --- | --- |
| `/dashboard` | Everyone signed in | Overview |
| `/dashboard/profile` | Everyone | My profile, my data |
| `/dashboard/announcements` | Approved members | Announcements from the church office. Admins post, edit and remove; the latest three also show on the overview |
| `/dashboard/ministries`, `/dashboard/ministries/:id` | Approved members | Ministries (Youth, Children, Women...) with programs, events, contacts and photos. Admins add, edit, delete and manage members |
| `/dashboard/library` | Approved members | Study documents (PDFs). Opened through the API with the sign-in token, so they cannot be reached without signing in |
| `/dashboard/requests` | Admins | What people sent through the public Get involved forms; add them to the register, ministries and clusters, or mark them done |
| `/dashboard/members`, `/dashboard/clusters`, `/dashboard/sign-up` | Admins | Member register, location and fundraising groups, sign-up link and invitations |

## Dashboard look

The dashboard and the sign-in pages (sign in, join, forgot and choose password) use the website's own blue (`#2e8eb4`) and yellow (`#ffc700`) on a light grey page, with icons (lucide). The token names are still `forest-*` (the blues) and `marigold-*` (the yellows).

- Colours, fonts and radii are defined once in `src/index.css` (`forest-*` = blues, `marigold-*` = yellows, `clay-*` = errors, `paper`, `ink`, `muted`, `line`). Fonts: Fraunces for headings and Instrument Sans for text.
- Wrap a page in the `app-theme` class to get the look (`AuthLayout` and `DashboardLayout` already do). Pages outside it are untouched.
- Each screen holds its own small UI pieces at the bottom of its file (no shared `ui/` folder). Things that worked show a toast (`useToast()`); errors stay next to the form (`FormError`).

## Changelog

### 2026-11-25: No shared UI files

- Removed `src/Components/ui/`. Every page and dialog now defines the buttons, fields, badges, modal and other pieces it uses at the bottom of its own file. Nothing looks or behaves differently.

### 2026-11-23: People create their own accounts

- The Sign in page has a "Create an account" link to `/join`. Anyone can sign up there with an email and password, with no link needed (Google sign-up comes later). New accounts still wait for an admin's approval.
- The shared link is now only a backup: `/join` opens the same page, and old links with `?code=` keep working. On Sign-up & invitations the link card shows the plain address with Copy and Share on WhatsApp (the switch off and make-a-new-link buttons are gone, as there is no code to cancel).
- Needs the backend change from the same day (sign-up without the link code).

### 2026-11-23: Get involved forms feed the dashboard

- The public Get involved forms now save their answers (they used to only email the church; the email is still sent). Every form asks for consent, and the ministry form offers the church's real ministries.
- New dashboard page "Get involved requests" for admins: review, add a person to the register and chosen ministries and clusters (people already in the register are only added to the groups), or mark done. New requests are flagged on the overview.
- The Privacy page mentions the forms.
- Needs the backend's Get involved release (`migrate`).

### 2026-11-22: Announcements

- New dashboard page for announcements, readable by every approved member. Admins post, edit, pin and remove them and can set a last day to show. The latest three appear on the overview.
- Needs the backend's announcements release (`migrate`).

### 2026-11-22: Ministries and Library move into the dashboard

- Ministries and the Library are now dashboard pages for approved members, with an admin view for ministries (add, edit, delete, manage members). The public Ministries and Library pages, menu links and footer links are gone; old addresses redirect to the dashboard.
- Members can be put into ministries from the member dialog and filtered by ministry on the register. Clusters are now location groups and fundraising groups.
- Needs the backend's ministries release (`migrate`).

### 2026-11-22: New look for the dashboard and sign-in pages

- Restyled with the design from the church's reference UI: dark icon sidebar (a drawer on phones), top bar with an account menu, split-screen sign-in, cards, badges, tables and dialogs that become bottom sheets on phones.
- Added `src/Components/ui/` and `src/Context/ToastContext.jsx`; removed `AuthCard` and the old dashboard `Modal`. The data fetching (loaders and `src/Api/`) is unchanged.
- Added the `@fontsource-variable/fraunces` and `@fontsource-variable/instrument-sans` packages. After pulling: `npm install`.

### 2026-11-22: Dashboard, member register, clusters and privacy (Phase 2)

- The portal is now the **Dashboard** (`/dashboard`, with a menu on the left; `/app` redirects). New pages: My profile, Members (register with search, filters, add/edit, import and export), Clusters, and Sign-up & invitations (the old People page, without the account table, which moved into the member dialog).
- Sign-up asks people to agree to the church keeping their details; there is a public Privacy page; members can download or delete their own data.
- `src/Api/client.js` gained `del` and `download` (for CSV and JSON files that need the sign-in token); the new endpoints are in `src/Api/index.js`.
- Needs the backend's Phase 2 release. After pulling: `npm install`.


### 2026-11-22: Sign-in accepts a username

- The sign-in box accepted only an email, so the original admin account (username only, no email) could not sign in. It now takes an email or a username. Add an email to that account in the admin panel so Google sign-in can find it too.

### 2026-11-22: Sign-in and the member portal (Phase 1)

- One shared sign-up link for the whole church: `/join?code=…` collects name, email, phone and a password. New sign-ups wait for an admin's approval; the People page has the link (Copy, Share on WhatsApp, switch off, make a new one), a "Waiting for approval" list and Approve/Reject buttons. Individual invitations remain for leaders and treasurers.
- The error page explains "too many requests" (429).

- Invitations work before email is set up: after inviting someone, the People page shows a link with a Copy button to send by WhatsApp. Once the backend has email set up, the email goes out as well.

- New pages: `/signin` (email and password, or Google), `/forgot-password`, `/reset-password` (also used to accept an invitation) and the portal under `/app`, with an admin-only People page for inviting people and changing roles.
- `src/Api/client.js` gained `post`, `patch`, stored sign-in tokens and a one-time automatic token renewal; the new endpoints are in `src/Api/index.js`, the guards are loaders in `src/Loaders/loaders.js`.
- The error page now explains 403 ("You don't have access to this page"). The navbar shows Sign in, or Portal when signed in.
- Needs the backend's Phase 1 release. After pulling: `npm install`. Google sign-in needs the `VITE_FIREBASE_*` values (see `.env.example`).

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

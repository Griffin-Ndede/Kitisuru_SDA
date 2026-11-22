// API base URL. Set VITE_API_BASE_URL in .env.local to override (see .env.example).
// Without it: local development talks to the local Django server and
// production builds talk to the live API.
const BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.DEV ? "http://127.0.0.1:8000" : "https://api.kitisurusda.org");

export default BASE_URL;

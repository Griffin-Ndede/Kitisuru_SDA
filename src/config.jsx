const BASE_URL = "http://127.0.0.1:8000/"; // local host url
// const PRODUCTION_API = "https://api.kitisurusda.org/";

// During the build-time prerender you can point at another API with
// PRERENDER_API_URL (e.g. a local backend). Browsers always use production.
// const BASE_URL =
//   (import.meta.env.SSR && globalThis.process?.env?.PRERENDER_API_URL) ||
//   PRODUCTION_API;

export default BASE_URL;

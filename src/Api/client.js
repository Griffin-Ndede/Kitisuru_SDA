import axios from "axios";
import BASE_URL from "../config";

// The one HTTP client for the whole site. No page or component builds URLs
// or imports axios itself.
const api = axios.create({
  baseURL: BASE_URL,
  // Loaders run before a page shows, so a request that hangs would make links
  // look broken. After 10 seconds the request fails and the error page shows.
  timeout: 10000,
});

// --- Sign-in session -------------------------------------------------------
// After signing in, the API gives an access token (short-lived) and a refresh
// token. They are kept in localStorage so a page reload keeps you signed in,
// and loaders (which run outside React) can read them.
const SESSION_KEY = "session";

export function getSession() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY)) || null;
  } catch {
    return null;
  }
}

export function saveSession(session) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

// --- Requests --------------------------------------------------------------
// `auth: true` sends the access token. It is opt-in so public endpoints never
// fail just because an old token is sitting in the browser.
async function send(method, endpoint, { auth = false, data } = {}) {
  const session = auth ? getSession() : null;
  const response = await api.request({
    method,
    url: endpoint,
    data,
    headers: session?.access ? { Authorization: `Bearer ${session.access}` } : {},
  });
  return response.data;
}

// An expired access token gets one automatic renewal with the refresh token.
// If that fails too, the session is cleared and the error goes on.
async function request(method, endpoint, options = {}) {
  try {
    return await send(method, endpoint, options);
  } catch (error) {
    const session = getSession();
    if (!(options.auth && error.response?.status === 401 && session?.refresh)) {
      throw error;
    }
    try {
      const { data } = await api.post("accounts/token/refresh/", {
        refresh: session.refresh,
      });
      saveSession({ ...session, access: data.access, refresh: data.refresh || session.refresh });
    } catch {
      clearSession();
      throw error;
    }
    return send(method, endpoint, options);
  }
}

export const get = (endpoint, options) => request("get", endpoint, options);
export const post = (endpoint, data, options) =>
  request("post", endpoint, { ...options, data });
export const patch = (endpoint, data, options) =>
  request("patch", endpoint, { ...options, data });

// A readable message from a failed request, for showing next to a form.
export function errorMessage(error, fallback = "Something went wrong. Please try again.") {
  const data = error?.response?.data;
  if (!data) return error?.code === "ECONNABORTED" || !error?.response
    ? "We could not reach the church server. Check your internet connection."
    : fallback;
  if (typeof data.detail === "string") return data.detail;
  const first = Object.values(data).flat()[0];
  return typeof first === "string" ? first : fallback;
}

export default api;

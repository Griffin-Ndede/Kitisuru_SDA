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
async function send(method, endpoint, { auth = false, data, responseType } = {}) {
  const session = auth ? getSession() : null;
  const response = await api.request({
    method,
    url: endpoint,
    data,
    responseType,
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
export const del = (endpoint, options) => request("delete", endpoint, options);

// Downloads a file the API makes (a CSV, a JSON copy of someone's details) and
// hands it to the browser to save. A plain link cannot do this because the
// request has to carry the sign-in token.
export async function download(endpoint, filename) {
  const blob = await request("get", endpoint, { auth: true, responseType: "blob" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

// Fetches a file the API protects (a PDF) and returns an address the browser can
// show in a frame. A plain frame cannot send the sign-in token, so the file is
// fetched here first. Give the address back with URL.revokeObjectURL when done.
export async function fetchFileUrl(endpoint) {
  const blob = await request("get", endpoint, { auth: true, responseType: "blob" });
  return URL.createObjectURL(blob);
}

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

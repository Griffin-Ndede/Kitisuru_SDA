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

export async function get(endpoint) {
  const response = await api.get(endpoint);
  return response.data;
}

export default api;

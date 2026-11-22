import axios from "axios";
import BASE_URL from "../config";

// One HTTP client for the whole site. The timeout makes a hanging API show
// the error page instead of freezing navigation.
export const client = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

// get(path) returns just the response body.
export async function get(path) {
  const response = await client.get(path);
  return response.data;
}

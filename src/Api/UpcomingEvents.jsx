import axios from "axios";
import BASE_URL from "../config";

export async function getUpcomingEvents() {
  const response = await axios.get(`${BASE_URL}/content-library/upcoming-events/`);
  return response.data;
}


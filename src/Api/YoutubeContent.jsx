import axios from "axios";
import BASE_URL from "../config";

export async function getYoutubeContent() {
  const response = await axios.get(`${BASE_URL}/content-library/youtube-links/`);
  return response.data;
}


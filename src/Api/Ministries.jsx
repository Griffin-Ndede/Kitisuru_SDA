import axios from "axios";
import BASE_URL from "../config";

export async function getMinistries() {
  const response = await axios.get(`${BASE_URL}/ministries/ministries/`);
  return response.data;
}


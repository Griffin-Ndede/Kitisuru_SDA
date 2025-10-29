import axios from "axios";
import BASE_URL from "../config";

export async function getMinistriesDetails( params ) {
    const { id } = params;
    
    const response = await axios.get(`${BASE_URL}/ministries/ministries/${id}/`);
    return response.data;
}


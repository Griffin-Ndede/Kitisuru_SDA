// The API the site talks to. Online, the host sets VITE_API_URL when it builds the site
// (for example https://my-api.example.org/, with the trailing slash). On your own
// computer it is left out and the site uses the backend running on port 8000.
const BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/";

export default BASE_URL;

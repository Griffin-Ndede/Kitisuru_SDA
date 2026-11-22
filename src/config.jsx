// Which API the website talks to.
//
// - `npm run dev` (your laptop): the local backend at http://127.0.0.1:8000/
// - `npm run build` (the live site): always https://api.kitisurusda.org/
//
// You do not need to edit this file when switching between the two.
// To make `npm run dev` use the live API instead, run:
//   VITE_API_URL=https://api.kitisurusda.org/ npm run dev
const LOCAL_API = "http://127.0.0.1:8000/";
const PRODUCTION_API = "https://api.kitisurusda.org/";

const BASE_URL =
  (import.meta.env.DEV && (import.meta.env.VITE_API_URL || LOCAL_API)) ||
  PRODUCTION_API;

export default BASE_URL;

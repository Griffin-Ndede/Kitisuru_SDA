// Every backend endpoint the site reads from, in one place.
// Loaders import from here. No UI logic and no error handling: errors are
// handled by the router's error page.
import { get } from "./client";

export const getMinistries = () => get("ministries/ministries/");
export const getMinistryDetails = (id) => get(`ministries/ministries/${id}/`);

export const getUpcomingEvents = () => get("content-library/upcoming-events/");
export const getYoutubeLinks = () => get("content-library/youtube-links/");

export const getDocuments = () => get("library/documents/");

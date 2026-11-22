// Every endpoint the site reads, in one place. No UI logic and no try/catch:
// errors travel up to the router's error page.
import { get } from "./client";

export const getMinistries = () => get("/ministries/ministries/");
export const getMinistry = (id) => get(`/ministries/ministries/${id}/`);
export const getUpcomingEvents = () => get("/content-library/upcoming-events/");
export const getYoutubeLinks = () => get("/content-library/youtube-links/");
export const getDocuments = () => get("/library/documents/");

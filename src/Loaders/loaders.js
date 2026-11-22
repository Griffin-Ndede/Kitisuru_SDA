// What data each page needs. React Router runs these before showing a page.
//
// Loaders don't catch errors: if a request fails, the error goes to
// <ErrorPage /> (errorElement in App.jsx), so every page handles failures
// the same way.
import { redirect } from "react-router";
import {
  getDocuments,
  getMe,
  getMinistries,
  getMinistryDetails,
  getUpcomingEvents,
  getUsers,
  getYoutubeLinks,
} from "../Api";
import { clearSession, getSession } from "../Api/client";

// Sermons and events are fetched at the same time.
export const homeLoader = async () => {
  const [youtubeContent, upcomingEvents] = await Promise.all([
    getYoutubeLinks(),
    getUpcomingEvents(),
  ]);
  return { youtubeContent, upcomingEvents };
};

export const ministriesLoader = async () => ({
  ministries: await getMinistries(),
});

export const ministryDetailsLoader = async ({ params }) => ({
  ministry: await getMinistryDetails(params.id),
});

export const resourcesLoader = async () => ({
  documents: await getDocuments(),
});

// --- Sign-in and the member portal -------------------------------------------

// Someone who is already signed in has no reason to see the sign-in page.
export const signInLoader = () => (getSession() ? redirect("/app") : null);

// Guards everything under /app: signed-out people go to the sign-in page.
// A token the server no longer accepts counts as signed out.
export const portalLoader = async () => {
  if (!getSession()) throw redirect("/signin");
  try {
    return { user: await getMe() };
  } catch (error) {
    if (error.response?.status === 401) {
      clearSession();
      throw redirect("/signin");
    }
    throw error;
  }
};

// Admin-only. A member opening this address gets a 403 from the API, which
// the error page explains.
export const peopleLoader = async () => ({ people: await getUsers() });

// What data each page needs. React Router runs these before showing a page.
//
// Loaders don't catch errors: if a request fails, the error goes to
// <ErrorPage /> (errorElement in App.jsx), so every page handles failures
// the same way.
import { redirect } from "react-router";
import {
  getAnnouncements,
  getDocuments,
  getInvolvedMinistries,
  getRequests,
  getClusters,
  getMe,
  getMembers,
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

// --- Sign-in and the dashboard -------------------------------------------

// Someone who is already signed in has no reason to see the sign-in page.
export const signInLoader = () => (getSession() ? redirect("/dashboard") : null);

// Guards everything under /dashboard: signed-out people go to the sign-in page.
// A token the server no longer accepts counts as signed out.
export const dashboardLoader = async () => {
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

// The member register, the clusters and the ministries. Admin-only: anyone else
// gets a 403 from the API, which the error page explains.
export const membersLoader = async () => {
  const [members, clusters, ministries] = await Promise.all([
    getMembers(),
    getClusters(),
    getMinistries(),
  ]);
  return { members, clusters, ministries };
};

// --- Announcements (any approved member) -----------------------------------

export const announcementsLoader = async () => {
  const [announcements, ministries] = await Promise.all([getAnnouncements(), getMinistries()]);
  return { announcements, ministries };
};

// The overview shows the latest announcements, but only approved people may
// read them, so check first instead of letting the request fail.
export const overviewLoader = async () => {
  const user = await getMe();
  const isAdmin = user.approved && user.role === "admin";
  const [announcements, requests] = await Promise.all([
    user.approved ? getAnnouncements() : [],
    isAdmin ? getRequests() : [],
  ]);
  return {
    announcements: announcements.slice(0, 3),
    newRequests: requests.filter((r) => r.status === "new").length,
  };
};

// --- Get involved ----------------------------------------------------------

// The public page: the ministry names for the "Join a ministry" form.
export const getInvolvedLoader = async () => ({
  ministries: await getInvolvedMinistries(),
});

// Admin only: what people sent, and the groups they can be added to.
export const requestsLoader = async () => {
  const [requests, clusters, ministries] = await Promise.all([
    getRequests(),
    getClusters(),
    getMinistries(),
  ]);
  return { requests, clusters, ministries };
};

// --- Ministries and the library (any approved member) ----------------------

export const ministriesLoader = async () => ({
  ministries: await getMinistries(),
});

// Only admins get a member list with the ministry, and only they may read the
// register, so only they need it here (to add people to the ministry).
export const ministryDetailsLoader = async ({ params }) => {
  const ministry = await getMinistryDetails(params.id);
  const [members, announcements] = await Promise.all([
    ministry.members ? getMembers() : [],
    getAnnouncements(params.id),
  ]);
  return { ministry, members, announcements };
};

export const libraryLoader = async () => ({
  documents: await getDocuments(),
});

// Admin-only: the shared sign-up link, people waiting for approval, invitations.
export const signUpAccessLoader = async () => {
  return { people: await getUsers() };
};

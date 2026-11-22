// What data each page needs. React Router runs these before showing a page.
//
// Loaders don't catch errors: if a request fails, the error goes to
// <ErrorPage /> (errorElement in App.jsx), so every page handles failures
// the same way.
import { redirect } from "react-router";
import {
  getDocuments,
  checkJoinLink,
  getClusters,
  getMe,
  getMembers,
  getMinistries,
  getMinistryDetails,
  getSignupLink,
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

// --- Ministries and the library (any approved member) ----------------------

export const ministriesLoader = async () => ({
  ministries: await getMinistries(),
});

// Only admins get a member list with the ministry, and only they may read the
// register, so only they need it here (to add people to the ministry).
export const ministryDetailsLoader = async ({ params }) => {
  const ministry = await getMinistryDetails(params.id);
  const members = ministry.members ? await getMembers() : [];
  return { ministry, members };
};

export const libraryLoader = async () => ({
  documents: await getDocuments(),
});

// Admin-only: the shared sign-up link, people waiting for approval, invitations.
export const signUpAccessLoader = async () => {
  const [people, signupLink] = await Promise.all([getUsers(), getSignupLink()]);
  return { people, signupLink };
};

// The shared sign-up page: asks the API whether the link in the address is
// still the current one, so the page can say so before anyone types anything.
export const joinLoader = async ({ request }) => {
  const code = new URL(request.url).searchParams.get("code") || "";
  const { valid } = code ? await checkJoinLink(code) : { valid: false };
  return { code, valid };
};

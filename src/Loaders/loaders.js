// What data each page needs. React Router runs these before showing a page.
//
// Loaders don't catch errors: if a request fails, the error goes to
// <ErrorPage /> (errorElement in App.jsx), so every page handles failures
// the same way.
import { redirect } from "react-router";
import {
  getAnnouncements,
  getDocuments,
  getHymn,
  getHymns,
  getInvolvedMinistries,
  getLeaders,
  getPositions,
  getAuditLog,
  hymnLanguages,
  getRequests,
  getCluster,
  getClusters,
  getMe,
  getMembers,
  getMinistries,
  getMinistryDetails,
  getUpcomingEvents,
  getUsers,
  getYoutubeLinks,
} from "../Api";
import { getSession } from "../Api/client";

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
// Who the person is lives in the user Context (UserContext), not here. If the
// server later refuses the tokens, the Context signs the person out and the
// dashboard layout sends them to the sign-in page.
export const dashboardLoader = () => {
  if (!getSession()) throw redirect("/signin");
  return null;
};

// The clusters list page. Admin-only, like everything about clusters.
export const clustersLoader = async () => ({
  clusters: await getClusters(),
});

// One cluster's page: its information, and the register to add people from.
export const clusterDetailsLoader = async ({ params }) => {
  const [cluster, members] = await Promise.all([getCluster(params.id), getMembers()]);
  return { cluster, members };
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

// --- Hymnal (any approved member) --------------------------------------------

// The page address says what to show: /dashboard/hymnal?language=sw&search=...&favourites=true
// Favourites span every language, so the language only filters when it is not the favourites view.
export const hymnsLoader = async ({ request }) => {
  const params = new URL(request.url).searchParams;
  const asked = params.get("language");
  const language = hymnLanguages.some((l) => l.code === asked) ? asked : "en";
  const search = (params.get("search") || "").trim();
  const favourites = params.get("favourites") === "true";
  const hymns = await getHymns({ language: favourites ? undefined : language, search, favourites });
  return { hymns, language, search, favourites };
};

// One hymn with its words, and its language's list so the page can offer the previous and next hymn.
export const hymnDetailsLoader = async ({ params }) => {
  const hymn = await getHymn(params.id);
  const siblings = await getHymns({ language: hymn.language });
  return { hymn, siblings };
};

// --- Ministries and the library (any approved member) ----------------------

export const ministriesLoader = async () => ({
  ministries: await getMinistries(),
});

// Only admins get a member list with the ministry, and only they may read the
// register, so only they need it here (to add people to the ministry).
export const ministryDetailsLoader = async ({ params }) => {
  const ministry = await getMinistryDetails(params.id);
  const [members, announcements, leaders] = await Promise.all([
    ministry.members ? getMembers() : [],
    getAnnouncements(params.id),
    getLeaders(params.id),
  ]);
  return { ministry, members, announcements, leaders };
};

// --- Leadership ---------------------------------------------------------------

// Every approved member: who is serving now.
export const leadersLoader = async () => ({ leaders: await getLeaders() });

// Admin only: the positions with their holders, the people who can be appointed, the ministries.
export const leadershipLoader = async () => {
  const [positions, members, ministries] = await Promise.all([getPositions(), getMembers(), getMinistries()]);
  return { positions, members, ministries };
};

// Admin only: the first page of the activity log, and the admins to filter it by.
export const auditLoader = async () => {
  const [log, members] = await Promise.all([getAuditLog(), getMembers()]);
  return { log, admins: members.filter((m) => m.role === "admin") };
};

export const libraryLoader = async () => ({
  documents: await getDocuments(),
});

// Admin-only: the shared sign-up link, people waiting for approval, invitations.
export const signUpAccessLoader = async () => {
  return { people: await getUsers() };
};

// Every backend endpoint the site reads from, in one place.
// Loaders import from here. No UI logic and no error handling: errors are
// handled by the router's error page.
import { del, download, fetchFileUrl, get, patch, post } from "./client";

// --- Ministries and the library (approved members only) -----------------------

export const getMinistries = () => get("ministries/ministries/", { auth: true });
export const getMinistryDetails = (id) =>
  get(`ministries/ministries/${id}/`, { auth: true });
export const createMinistry = (details) =>
  post("ministries/ministries/", details, { auth: true });
export const updateMinistry = (id, details) =>
  patch(`ministries/ministries/${id}/`, details, { auth: true });
export const deleteMinistry = (id) =>
  del(`ministries/ministries/${id}/`, { auth: true });
export const changeMinistryMembers = (id, changes) =>
  post(`ministries/ministries/${id}/members/`, changes, { auth: true });

export const getDocuments = () => get("library/documents/", { auth: true });
export const getDocumentFileUrl = (slug) => fetchFileUrl(`library/documents/${slug}/`);

// --- Hymnal (approved members only; hymns are loaded by the backend's import command) ---

// The books the backend holds: English is the SDA Hymnal, the rest are Christ In Song.
export const hymnLanguages = [
  { code: "en", label: "English" },
  { code: "sw", label: "Kiswahili" },
  { code: "luo", label: "Dholuo" },
  { code: "guz", label: "Ekegusii" },
  { code: "ki", label: "Kikuyu" },
];

// The list has no words. search: digits go to that hymn number, otherwise a word in the title or lyrics.
export const getHymns = ({ language, search, favourites } = {}) => {
  const params = new URLSearchParams();
  if (language) params.set("language", language);
  if (search) params.set("search", search);
  if (favourites) params.set("favourites", "true");
  const query = params.toString();
  return get(query ? `hymns/?${query}` : "hymns/", { auth: true });
};
export const getHymn = (id) => get(`hymns/${id}/`, { auth: true });
export const favouriteHymn = (id) => post(`hymns/${id}/favourite/`, {}, { auth: true });
export const unfavouriteHymn = (id) => del(`hymns/${id}/favourite/`, { auth: true });

// With a ministry id: only that ministry's announcements (its page in the dashboard).
export const getAnnouncements = (ministryId) =>
  get(ministryId ? `announcements/?ministry=${ministryId}` : "announcements/", { auth: true });
export const createAnnouncement = (details) =>
  post("announcements/", details, { auth: true });
export const updateAnnouncement = (id, details) =>
  patch(`announcements/${id}/`, details, { auth: true });
export const deleteAnnouncement = (id) => del(`announcements/${id}/`, { auth: true });

// --- Leadership: elected positions (Elder, Treasurer...) and two-year terms ---

// Everyone approved can read who is serving; with a ministry id, only that ministry's leaders.
export const getLeaders = (ministryId) =>
  get(ministryId ? `leadership/leaders/?ministry=${ministryId}` : "leadership/leaders/", { auth: true });
// Admin only from here on
export const getPositions = () => get("leadership/positions/", { auth: true });
export const createPosition = (details) => post("leadership/positions/", details, { auth: true });
export const updatePosition = (id, details) => patch(`leadership/positions/${id}/`, details, { auth: true });
export const deletePosition = (id) => del(`leadership/positions/${id}/`, { auth: true });
export const createAssignment = (details) => post("leadership/assignments/", details, { auth: true });
export const updateAssignment = (id, details) => patch(`leadership/assignments/${id}/`, details, { auth: true });
export const deleteAssignment = (id) => del(`leadership/assignments/${id}/`, { auth: true });

// The activity log: who changed what. Filters: actor (admin's id), search (words), before (entry id, for the next older page).
export const getAuditLog = ({ actor = "", search = "", before = "" } = {}) => {
  const params = new URLSearchParams();
  if (actor) params.set("actor", actor);
  if (search) params.set("search", search);
  if (before) params.set("before", before);
  const query = params.toString();
  return get(`audit/${query ? `?${query}` : ""}`, { auth: true });
};

// --- Get involved: the public forms and the admin's requests ------------------

export const getInvolvedMinistries = () => get("get-involved/ministries/");
export const sendGetInvolved = (form) => post("get-involved/", form);
export const getRequests = () => get("get-involved/requests/", { auth: true });
export const updateRequest = (id, changes) =>
  patch(`get-involved/requests/${id}/`, changes, { auth: true });
export const addRequestToRegister = (id, groups) =>
  post(`get-involved/requests/${id}/add-member/`, groups, { auth: true });

// --- Home page content (public) ---------------------------------------------

export const getUpcomingEvents = () => get("content-library/upcoming-events/");
export const getYoutubeLinks = () => get("content-library/youtube-links/");


// --- Accounts and sign-in ---------------------------------------------------

// The shared sign-up link the church puts in its WhatsApp group.
export const register = (details) => post("accounts/register/", details);

export const login = (email, password) =>
  post("accounts/login/", { email, password });
export const googleLogin = (token) => post("accounts/google-login/", { token });
export const requestPasswordReset = (email) =>
  post("accounts/password-reset/", { email });
// Used by both "forgot password" and "accept invitation" links.
export const setPassword = (uid, token, password) =>
  post("accounts/set-password/", { uid, token, password });

export const getMe = () => get("accounts/me/", { auth: true });
export const getUsers = () => get("accounts/users/", { auth: true });
export const inviteUser = (person) =>
  post("accounts/invitations/", person, { auth: true });
export const updateUser = (id, changes) =>
  patch(`accounts/users/${id}/`, changes, { auth: true });
export const resendInvitation = (id) =>
  post(`accounts/users/${id}/resend-invitation/`, {}, { auth: true });

// --- My profile and privacy ---------------------------------------------------
export const updateMe = (details) => patch("accounts/me/", details, { auth: true });
export const downloadMyData = () =>
  download("accounts/me/data/", "my-kitisuru-details.json");
export const deleteMyAccount = (confirm) =>
  post("accounts/me/delete/", { confirm }, { auth: true });

// --- Members and clusters (admins) ----------------------------------------------
export const getMembers = () => get("members/", { auth: true });
export const addMember = (details) => post("members/", details, { auth: true });
export const updateMember = (id, details) =>
  patch(`members/${id}/`, details, { auth: true });
export const deleteMember = (id) => del(`members/${id}/`, { auth: true });

export const getClusters = () => get("members/clusters/", { auth: true });
export const getCluster = (id) => get(`members/clusters/${id}/`, { auth: true });
export const createCluster = (cluster) =>
  post("members/clusters/", cluster, { auth: true });
export const updateCluster = (id, changes) =>
  patch(`members/clusters/${id}/`, changes, { auth: true });
export const deleteCluster = (id) => del(`members/clusters/${id}/`, { auth: true });
// changes: { add: [memberIds], remove: [memberIds] }
export const changeClusterMembers = (id, changes) =>
  post(`members/clusters/${id}/members/`, changes, { auth: true });

export const exportMembers = () =>
  download("members/export/", "kitisuru-members.csv");
export const downloadImportTemplate = () =>
  download("members/import-template/", "members-template.csv");
// dryRun true: check the file and report, save nothing.
export const importMembers = (file, { dryRun, confirmPermission = false }) => {
  const form = new FormData();
  form.append("file", file);
  form.append("dry_run", dryRun ? "true" : "false");
  form.append("confirm_permission", confirmPermission ? "true" : "false");
  return post("members/import/", form, { auth: true });
};

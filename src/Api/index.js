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

export const getAnnouncements = () => get("announcements/", { auth: true });
export const createAnnouncement = (details) =>
  post("announcements/", details, { auth: true });
export const updateAnnouncement = (id, details) =>
  patch(`announcements/${id}/`, details, { auth: true });
export const deleteAnnouncement = (id) => del(`announcements/${id}/`, { auth: true });

// --- Home page content (public) ---------------------------------------------

export const getUpcomingEvents = () => get("content-library/upcoming-events/");
export const getYoutubeLinks = () => get("content-library/youtube-links/");


// --- Accounts and sign-in ---------------------------------------------------

// The shared sign-up link the church puts in its WhatsApp group.
export const checkJoinLink = (code) =>
  get(`accounts/join/?code=${encodeURIComponent(code)}`);
export const register = (details) => post("accounts/register/", details);
export const getSignupLink = () => get("accounts/signup-link/", { auth: true });
export const makeNewSignupLink = () =>
  post("accounts/signup-link/", {}, { auth: true });
export const setSignupLinkActive = (isActive) =>
  patch("accounts/signup-link/", { is_active: isActive }, { auth: true });

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

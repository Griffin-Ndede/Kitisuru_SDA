// Every backend endpoint the site reads from, in one place.
// Loaders import from here. No UI logic and no error handling: errors are
// handled by the router's error page.
import { get, patch, post } from "./client";

export const getMinistries = () => get("ministries/ministries/");
export const getMinistryDetails = (id) => get(`ministries/ministries/${id}/`);

export const getUpcomingEvents = () => get("content-library/upcoming-events/");
export const getYoutubeLinks = () => get("content-library/youtube-links/");

export const getDocuments = () => get("library/documents/");

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

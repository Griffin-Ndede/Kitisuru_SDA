import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { getMe } from "../Api";
import { clearSession, getSession, saveSession, SESSION_ENDED, SESSION_KEY } from "../Api/client";
import { googleSignOut } from "../firebase";

// The signed-in person, available to every page and component through useUser().
// It is the one place that knows who is signed in: pages do not fetch the user,
// keep their own copy or read the tokens. They ask this Context.
const UserContext = createContext(null);

export function UserProvider({ children }) {
  // 1. The user. It starts from the copy saved with the session, so a reload paints
  //    the right name and menu at once instead of flashing "Sign in". Step 4
  //    then asks the server who this really is and replaces it.
  const [user, setUser] = useState(() => getSession()?.user ?? null);

  // 2. `loading` is true only while that first check with the server is running
  //    (and only when there is a session to check).
  const [loading, setLoading] = useState(() => Boolean(getSession()));

  // True from the moment someone chooses to sign out until they sign in again. It lets the
  // dashboard tell "they left on purpose" (they are already heading to the church website)
  // from "the session was refused" (send them to the sign-in page).
  const [leaving, setLeaving] = useState(false);

  // Keep the copy saved with the session in step with what the server says, so
  // the next reload starts from fresh details.
  const remember = useCallback((fresh) => {
    const session = getSession();
    if (session) saveSession({ ...session, user: fresh });
  }, []);

  // 3. refreshUser: ask the server for the current details and store them.
  //    Call it after anything that changes the person (saving the profile).
  //    A 401 means the server no longer accepts the tokens: the person is
  //    signed out. Any other failure is thrown, so the caller can show it.
  const refreshUser = useCallback(async () => {
    try {
      const fresh = await getMe();
      setUser(fresh);
      remember(fresh);
      return fresh;
    } catch (error) {
      if (error.response?.status === 401) {
        clearSession();
        return null;
      }
      throw error;
    }
  }, [remember]);

  // 4. On first load: if there is a session, confirm it with the server.
  useEffect(() => {
    if (!getSession()) return;
    refreshUser()
      .catch(() => {}) // offline or a server error: keep what we have, the next request will say
      .finally(() => setLoading(false));
  }, [refreshUser]);

  // 5. Stay right when the session changes behind the page's back.
  useEffect(() => {
    // Same tab: the session ended (sign-out, or the API refused the tokens).
    const onEnded = () => setUser(null);
    // Other tabs: signing out in one tab signs out all of them; signing in
    // as someone else in another tab switches this one to that person.
    const onStorage = (event) => {
      if (event.key !== SESSION_KEY) return;
      if (!event.newValue) return setUser(null);
      try {
        setUser(JSON.parse(event.newValue).user ?? null);
      } catch {
        setUser(null);
      }
    };
    window.addEventListener(SESSION_ENDED, onEnded);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener(SESSION_ENDED, onEnded);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  // 6. signIn: used by every way of getting in (password, sign-up). It keeps the
  //    tokens (so reloads and loaders can use them) and makes the person the current user.
  const signIn = useCallback((session) => {
    saveSession(session);
    setUser(session.user ?? null);
    setLoading(false);
    setLeaving(false);
  }, []);

  // 7. signOut: sign out of Google first (if they used it), then remove the
  //    session. Removing it announces SESSION_ENDED, which empties `user`.
  const signOut = useCallback(async () => {
    setLeaving(true);
    await googleSignOut();
    clearSession();
  }, []);

  // 8. Everything a component usually wants to know, worked out once here so that
  //    "is this an admin?" has one definition for the whole app.
  const value = useMemo(() => {
    const role = user?.role ?? null;
    const isApproved = Boolean(user?.approved);
    return {
      user,
      loading,
      leaving,
      isSignedIn: Boolean(user),
      role,
      isApproved,
      // Only an approved account has any rights; the API enforces the same rule.
      isAdmin: isApproved && role === "admin",
      hasRole: (...roles) => isApproved && roles.includes(role),
      signIn,
      signOut,
      refreshUser,
    };
  }, [user, loading, leaving, signIn, signOut, refreshUser]);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

// 9. useUser: how any component reads all of the above.
// eslint-disable-next-line react-refresh/only-export-components
export function useUser() {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used inside <UserProvider>");
  return context;
}

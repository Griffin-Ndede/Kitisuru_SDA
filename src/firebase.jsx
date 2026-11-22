// Google sign-in through Firebase. The Firebase code is loaded only when
// someone actually clicks "Continue with Google", so the public pages stay light.
//
// The values come from .env (see .env.example). Without them the Google button
// is hidden and email sign-in keeps working.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const googleEnabled = Boolean(
  firebaseConfig.apiKey && firebaseConfig.authDomain && firebaseConfig.projectId
);

async function getAuthTools() {
  const [{ initializeApp, getApps }, authModule] = await Promise.all([
    import("firebase/app"),
    import("firebase/auth"),
  ]);
  const app = getApps()[0] || initializeApp(firebaseConfig);
  return { auth: authModule.getAuth(app), ...authModule };
}

// Opens Google's popup and returns a Firebase ID token for our backend to check.
export async function googleSignIn() {
  const { auth, GoogleAuthProvider, signInWithPopup } = await getAuthTools();
  const result = await signInWithPopup(auth, new GoogleAuthProvider());
  return result.user.getIdToken();
}

// Signing out must also end the Google session, so the next sign-in
// shows the account chooser.
export async function googleSignOut() {
  if (!googleEnabled) return;
  try {
    const { auth, signOut } = await getAuthTools();
    await signOut(auth);
  } catch {
    // nothing to sign out of
  }
}

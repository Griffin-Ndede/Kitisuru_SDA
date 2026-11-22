import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import AuthCard, { buttonClass, inputClass } from "../Components/AuthCard";
import { googleLogin, login } from "../Api";
import { errorMessage, saveSession } from "../Api/client";
import { googleEnabled, googleSignIn } from "../firebase";

export default function SignIn() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  // Both ways of signing in end the same way: keep the tokens, open the portal.
  const finish = (session) => {
    saveSession(session);
    navigate("/app");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      finish(await login(email, password));
    } catch (err) {
      setError(errorMessage(err));
      setBusy(false);
    }
  };

  const handleGoogle = async () => {
    setError("");
    setBusy(true);
    try {
      finish(await googleLogin(await googleSignIn()));
    } catch (err) {
      // closing Google's popup is not an error worth showing
      const closed = err?.code === "auth/popup-closed-by-user" || err?.code === "auth/cancelled-popup-request";
      setError(closed ? "" : errorMessage(err, "Google sign-in failed. Please try again."));
      setBusy(false);
    }
  };

  return (
    <AuthCard
      title="Sign in"
      intro="For members and church leaders."
      footer={<Link to="/forgot-password" className="underline">Forgot your password?</Link>}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <input className={inputClass} type="text" inputMode="email" placeholder="Email or username" autoComplete="username"
          autoCapitalize="none" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input className={inputClass} type="password" placeholder="Password" autoComplete="current-password"
          value={password} onChange={(e) => setPassword(e.target.value)} required />
        {error && <p role="alert" className="text-red-600 text-sm">{error}</p>}
        <button type="submit" disabled={busy} className={buttonClass}>
          {busy ? "Please wait…" : "Sign in"}
        </button>
      </form>
      {googleEnabled && (
        <>
          <p className="text-center text-gray-400 text-sm my-4">or</p>
          <button type="button" onClick={handleGoogle} disabled={busy}
            className="w-full px-6 py-3 rounded-full border border-gray-300 font-semibold cursor-pointer disabled:opacity-60">
            Continue with Google
          </button>
        </>
      )}
      <p className="text-xs text-gray-500 mt-6">
        New here? Use the sign-up link the church shared in the WhatsApp group.
      </p>
    </AuthCard>
  );
}

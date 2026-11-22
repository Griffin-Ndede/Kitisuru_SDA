import React, { useState } from "react";
import { Link, useSearchParams } from "react-router";
import AuthCard, { buttonClass, inputClass } from "../Components/AuthCard";
import { setPassword } from "../Api";
import { errorMessage } from "../Api/client";

// Opened from the link in an invitation or password-reset email.
export default function ResetPassword() {
  const [params] = useSearchParams();
  const uid = params.get("uid");
  const token = params.get("token");
  const [password, setPasswordValue] = useState("");
  const [confirm, setConfirm] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (password !== confirm) {
      setError("The two passwords are not the same.");
      return;
    }
    setBusy(true);
    try {
      await setPassword(uid, token, password);
      setDone(true);
    } catch (err) {
      setError(errorMessage(err));
    }
    setBusy(false);
  };

  if (!uid || !token) {
    return (
      <AuthCard title="This link is incomplete" footer={<Link to="/forgot-password" className="underline">Ask for a new link</Link>}>
        <p className="text-gray-600">Open the link from your email again, or ask for a new one.</p>
      </AuthCard>
    );
  }

  if (done) {
    return (
      <AuthCard title="Password saved">
        <p className="text-gray-600 mb-6">You can sign in now.</p>
        <Link to="/signin" className={`${buttonClass} block text-center`}>Go to sign in</Link>
      </AuthCard>
    );
  }

  return (
    <AuthCard title="Choose your password" intro="Use at least 8 characters that are not all numbers.">
      <form onSubmit={handleSubmit} className="space-y-4">
        <input className={inputClass} type="password" placeholder="New password" autoComplete="new-password"
          value={password} onChange={(e) => setPasswordValue(e.target.value)} required />
        <input className={inputClass} type="password" placeholder="Repeat the password" autoComplete="new-password"
          value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
        {error && <p role="alert" className="text-red-600 text-sm">{error}</p>}
        <button type="submit" disabled={busy} className={buttonClass}>
          {busy ? "Please wait…" : "Save password"}
        </button>
      </form>
    </AuthCard>
  );
}

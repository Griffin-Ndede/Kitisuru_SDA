import React, { useState } from "react";
import { Link } from "react-router";
import AuthCard, { buttonClass, inputClass } from "../Components/AuthCard";
import { requestPasswordReset } from "../Api";
import { errorMessage } from "../Api/client";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const reply = await requestPasswordReset(email);
      setMessage(reply.detail);
    } catch (err) {
      setError(errorMessage(err));
    }
    setBusy(false);
  };

  return (
    <AuthCard
      title="Forgot your password?"
      intro="Enter your email and we will send you a link to choose a new one."
      footer={<Link to="/signin" className="underline">Back to sign in</Link>}
    >
      {message ? (
        <p role="status" className="text-green-700">{message}</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <input className={inputClass} type="email" placeholder="Email" autoComplete="email"
            value={email} onChange={(e) => setEmail(e.target.value)} required />
          {error && <p role="alert" className="text-red-600 text-sm">{error}</p>}
          <button type="submit" disabled={busy} className={buttonClass}>
            {busy ? "Please wait…" : "Send reset link"}
          </button>
        </form>
      )}
    </AuthCard>
  );
}

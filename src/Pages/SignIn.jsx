import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import AuthLayout from "../Components/ui/AuthLayout";
import Button from "../Components/ui/Button";
import { Input } from "../Components/ui/Fields";
import { FormError } from "../Components/ui/States";
import { googleLogin, login } from "../Api";
import { errorMessage, saveSession } from "../Api/client";
import { googleEnabled, googleSignIn } from "../firebase";

export default function SignIn() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  // Both ways of signing in end the same way: keep the tokens, open the dashboard.
  const finish = (session) => {
    saveSession(session);
    navigate("/dashboard");
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
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to the church dashboard."
      footer={<Link to="/forgot-password" className="font-medium text-forest-700 underline">Forgot your password?</Link>}
    >
      <meta name="robots" content="noindex" />
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Email or username" type="text" inputMode="email" autoComplete="username" autoCapitalize="none"
          value={email} onChange={(e) => setEmail(e.target.value)} required />
        <Input label="Password" type="password" autoComplete="current-password"
          value={password} onChange={(e) => setPassword(e.target.value)} required />
        <FormError>{error}</FormError>
        <Button type="submit" size="lg" className="w-full" loading={busy}>Sign in</Button>
      </form>
      {googleEnabled && (
        <>
          <p className="my-4 text-center text-sm text-muted">or</p>
          <Button variant="secondary" size="lg" className="w-full" onClick={handleGoogle} disabled={busy}>
            Continue with Google
          </Button>
        </>
      )}
      <p className="mt-6 text-center text-xs text-muted">
        New here? Use the sign-up link the church shared in the WhatsApp group.
      </p>
    </AuthLayout>
  );
}

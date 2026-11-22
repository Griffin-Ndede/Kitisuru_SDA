import React, { useState } from "react";
import { Link, useSearchParams } from "react-router";
import AuthLayout from "../Components/ui/AuthLayout";
import Button from "../Components/ui/Button";
import { Input } from "../Components/ui/Fields";
import { FormError, Notice } from "../Components/ui/States";
import { KeyRound, CircleCheck, Link2 } from "lucide-react";
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
      <AuthLayout title="This link is incomplete" footer={<Link to="/forgot-password" className="font-medium text-forest-700 underline">Ask for a new link</Link>}>
        <Notice icon={Link2} title="Open the link from your email again">Or ask for a new one.</Notice>
      </AuthLayout>
    );
  }

  if (done) {
    return (
      <AuthLayout title="Password saved">
        <Notice icon={CircleCheck} title="All set">You can sign in now.</Notice>
        <Button to="/signin" size="lg" className="w-full">Go to sign in</Button>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Choose your password" subtitle="Use at least 8 characters that are not all numbers.">
      <meta name="robots" content="noindex" />
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="New password" type="password" autoComplete="new-password"
          value={password} onChange={(e) => setPasswordValue(e.target.value)} required />
        <Input label="Repeat the password" type="password" autoComplete="new-password"
          value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
        <FormError>{error}</FormError>
        <Button type="submit" size="lg" className="w-full" icon={KeyRound} loading={busy}>Save password</Button>
      </form>
    </AuthLayout>
  );
}

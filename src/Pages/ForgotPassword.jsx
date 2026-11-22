import React, { useState } from "react";
import { Link } from "react-router";
import AuthLayout from "../Components/ui/AuthLayout";
import Button from "../Components/ui/Button";
import { Input } from "../Components/ui/Fields";
import { FormError, Notice } from "../Components/ui/States";
import { MailCheck } from "lucide-react";
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
    <AuthLayout
      title="Forgot your password?"
      subtitle="Enter your email and we will send you a link to choose a new one."
      footer={<Link to="/signin" className="font-medium text-forest-700 underline">Back to sign in</Link>}
    >
      <meta name="robots" content="noindex" />
      {message ? (
        <Notice icon={MailCheck} title="Check your email">{message}</Notice>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <FormError>{error}</FormError>
          <Button type="submit" size="lg" className="w-full" loading={busy}>Send reset link</Button>
        </form>
      )}
    </AuthLayout>
  );
}

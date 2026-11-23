import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import AuthLayout from "../Components/ui/AuthLayout";
import Button from "../Components/ui/Button";
import { Input, Checkbox } from "../Components/ui/Fields";
import { FormError } from "../Components/ui/States";
import { googleLogin, register } from "../Api";
import { errorMessage, saveSession } from "../Api/client";
import { googleEnabled, googleSignIn } from "../firebase";

// Anyone can create their own account here. The church's shared link (posted in
// the WhatsApp group) just opens this same page.
export default function Join() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    first_name: "", last_name: "", email: "", phone: "", password: "", confirm: "",
  });
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirm) {
      setError("The two passwords are not the same.");
      return;
    }
    setBusy(true);
    try {
      const { first_name, last_name, email, phone, password } = form;
      saveSession(await register({ first_name, last_name, email, phone, password, consent }));
      navigate("/dashboard");
    } catch (err) {
      setError(errorMessage(err));
      setBusy(false);
    }
  };

  const handleGoogle = async () => {
    setError("");
    if (!consent) {
      setError("Please tick the box to agree to the church keeping your details.");
      return;
    }
    setBusy(true);
    try {
      saveSession(await googleLogin(await googleSignIn(), true));
      navigate("/dashboard");
    } catch (err) {
      // closing Google's popup is not an error worth showing
      const closed = err?.code === "auth/popup-closed-by-user" || err?.code === "auth/cancelled-popup-request";
      setError(closed ? "" : errorMessage(err, "Google sign-in failed. Please try again."));
      setBusy(false);
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Fill in your details and choose a password. The church office will approve your account."
      footer={<Link to="/signin" className="font-medium text-forest-700 underline">Already have an account? Sign in</Link>}
    >
      <meta name="robots" content="noindex" />
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Input label="First name" name="first_name" autoComplete="given-name" value={form.first_name} onChange={change} required />
          <Input label="Last name" name="last_name" autoComplete="family-name" value={form.last_name} onChange={change} required />
        </div>
        <Input label="Email" type="email" name="email" autoComplete="email" value={form.email} onChange={change} required />
        <Input label="Phone number" type="tel" name="phone" placeholder="e.g. 0712 345 678" autoComplete="tel"
          value={form.phone} onChange={change} required />
        <Input label="Choose a password" type="password" name="password" autoComplete="new-password"
          value={form.password} onChange={change} required />
        <Input label="Repeat the password" type="password" name="confirm" autoComplete="new-password"
          value={form.confirm} onChange={change} required />
        <Checkbox
          required checked={consent} onChange={(e) => setConsent(e.target.checked)}
          label="I agree to the church keeping these details to run its member register."
          hint={<a href="/privacy" target="_blank" rel="noreferrer" className="text-forest-700 underline">How we use your details</a>}
        />
        <FormError>{error}</FormError>
        <Button type="submit" size="lg" className="w-full" loading={busy}>Sign up</Button>
      </form>
      {googleEnabled && (
        <>
          <p className="my-4 text-center text-sm text-muted">or</p>
          <Button variant="secondary" size="lg" className="w-full" onClick={handleGoogle} disabled={busy}>
            Sign up with Google
          </Button>
        </>
      )}
    </AuthLayout>
  );
}

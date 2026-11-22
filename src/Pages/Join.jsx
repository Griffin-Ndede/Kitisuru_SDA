import React, { useState } from "react";
import { Link, useLoaderData, useNavigate } from "react-router";
import AuthCard, { buttonClass, inputClass } from "../Components/AuthCard";
import { register } from "../Api";
import { errorMessage, saveSession } from "../Api/client";

// The page behind the shared sign-up link the church puts in its WhatsApp group.
export default function Join() {
  const { code, valid } = useLoaderData();
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
      saveSession(await register({ first_name, last_name, email, phone, password, consent, code }));
      navigate("/dashboard");
    } catch (err) {
      setError(errorMessage(err));
      setBusy(false);
    }
  };

  if (!valid) {
    return (
      <AuthCard
        title="This sign-up link is not valid"
        footer={<Link to="/signin" className="underline">Already have an account? Sign in</Link>}
      >
        <p className="text-gray-600">
          The link may be old or switched off. Please ask the church office for the current link.
        </p>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Join the Kitisuru SDA church family online"
      intro="Fill in your details and choose a password. The church office will approve your account."
      footer={<Link to="/signin" className="underline">Already have an account? Sign in</Link>}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <input className={inputClass} name="first_name" placeholder="First name" autoComplete="given-name"
            value={form.first_name} onChange={change} required />
          <input className={inputClass} name="last_name" placeholder="Last name" autoComplete="family-name"
            value={form.last_name} onChange={change} required />
        </div>
        <input className={inputClass} type="email" name="email" placeholder="Email" autoComplete="email"
          value={form.email} onChange={change} required />
        <input className={inputClass} type="tel" name="phone" placeholder="Phone number (e.g. 0712 345 678)" autoComplete="tel"
          value={form.phone} onChange={change} required />
        <input className={inputClass} type="password" name="password" placeholder="Choose a password" autoComplete="new-password"
          value={form.password} onChange={change} required />
        <input className={inputClass} type="password" name="confirm" placeholder="Repeat the password" autoComplete="new-password"
          value={form.confirm} onChange={change} required />
        <label className="flex items-start gap-2 text-sm text-gray-700">
          <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-1" required />
          <span>
            I agree to the church keeping these details to run its member register.{" "}
            <a href="/privacy" target="_blank" rel="noreferrer" className="text-custom-blue underline">How we use your details</a>
          </span>
        </label>
        {error && <p role="alert" className="text-red-600 text-sm">{error}</p>}
        <button type="submit" disabled={busy} className={buttonClass}>
          {busy ? "Please wait…" : "Sign up"}
        </button>
      </form>
    </AuthCard>
  );
}

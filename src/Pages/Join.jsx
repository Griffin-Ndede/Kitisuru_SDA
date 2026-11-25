import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { register } from "../Api";
import { errorMessage } from "../Api/client";
import { useUser } from "../Context/UserContext";
import { LoaderCircle, CircleAlert } from "lucide-react";

// Anyone can create their own account here. The church's shared link (posted in
// the WhatsApp group) just opens this same page.
export default function Join() {
  const navigate = useNavigate();
  const { signIn } = useUser();
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    password: "",
    confirm: "",
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
      signIn(await register({ first_name, last_name, email, phone, password, consent }));
      navigate("/dashboard");
    } catch (err) {
      setError(errorMessage(err));
      setBusy(false);
    }
  };

  return (
    <div className="app-theme grid min-h-screen lg:grid-cols-2">
      <main className="flex flex-col px-6 py-8 sm:px-12">
        <Link
          to={"/"}
          className="inline-flex items-center gap-2.5 text-forest-900"
          aria-label="Kitisuru SDA Church, home"
        >
          <img src="/logo-icon.png" alt="" aria-hidden="true" className="h-9 w-auto shrink-0" />
          <span className="leading-none">
            <span className="block font-display text-lg font-semibold tracking-tight">Kitisuru</span>
            <span className="block text-[0.65rem] font-semibold uppercase tracking-[0.2em] opacity-70">SDA Church</span>
          </span>
        </Link>
        <div className="rise mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-10">
          <h1 className="text-4xl font-semibold">Create your account</h1>
          <p className="mt-2 text-muted">
            Fill in your details and choose a password. The church office will approve your account.
          </p>
          <div className="mt-8">
            <meta name="robots" content="noindex" />
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block">
                    <span className="mb-1.5 block text-sm font-medium">
                      First name <span className="text-clay-600">*</span>
                    </span>
                    <input
                      className="input"
                      required
                      name="first_name"
                      autoComplete="given-name"
                      value={form.first_name}
                      onChange={change}
                    />
                  </label>
                </div>
                <div>
                  <label className="block">
                    <span className="mb-1.5 block text-sm font-medium">
                      Last name <span className="text-clay-600">*</span>
                    </span>
                    <input
                      className="input"
                      required
                      name="last_name"
                      autoComplete="family-name"
                      value={form.last_name}
                      onChange={change}
                    />
                  </label>
                </div>
              </div>
              <div>
                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium">
                    Email <span className="text-clay-600">*</span>
                  </span>
                  <input
                    className="input"
                    required
                    type="email"
                    name="email"
                    autoComplete="email"
                    value={form.email}
                    onChange={change}
                  />
                </label>
              </div>
              <div>
                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium">
                    Phone number <span className="text-clay-600">*</span>
                  </span>
                  <input
                    className="input"
                    required
                    type="tel"
                    name="phone"
                    autoComplete="tel"
                    value={form.phone}
                    onChange={change}
                  />
                </label>
              </div>
              <div>
                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium">
                    Choose a password <span className="text-clay-600">*</span>
                  </span>
                  <input
                    className="input"
                    required
                    type="password"
                    name="password"
                    autoComplete="new-password"
                    value={form.password}
                    onChange={change}
                  />
                </label>
              </div>
              <div>
                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium">
                    Repeat the password <span className="text-clay-600">*</span>
                  </span>
                  <input
                    className="input"
                    required
                    type="password"
                    name="confirm"
                    autoComplete="new-password"
                    value={form.confirm}
                    onChange={change}
                  />
                </label>
              </div>
              <label className="flex items-start gap-3 text-sm">
                <input
                  type="checkbox"
                  required
                  checked={Boolean(consent)}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-0.5 size-4 rounded accent-forest-700"
                />
                <span>
                  <span className="font-medium">
                    I agree to the church keeping these details to run its member register.
                  </span>
                  <span className="block text-xs text-muted">
                    {
                      <a href="/privacy" target="_blank" rel="noreferrer" className="text-forest-700 underline">
                        How we use your details
                      </a>
                    }
                  </span>
                </span>
              </label>
              {error && (
                <p
                  role="alert"
                  className="flex items-start gap-2 rounded-xl bg-clay-100 px-3.5 py-2.5 text-sm text-clay-700"
                >
                  <CircleAlert className="mt-0.5 size-4 shrink-0" />
                  {error}
                </p>
              )}
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-full font-semibold transition active:translate-y-px disabled:opacity-60 bg-forest-900 text-paper hover:bg-forest-800 shadow-card px-6 py-3.5 text-base w-full"
                disabled={busy}
              >
                {busy && <LoaderCircle className="size-4 animate-spin" />}
                Sign up
              </button>
            </form>
          </div>
          <div className="mt-6 text-center text-sm text-muted">
            <Link to="/signin" className="font-medium text-forest-700 underline">
              Already have an account? Sign in
            </Link>
          </div>
        </div>
        <p className="text-center text-xs text-muted">
          <Link to="/privacy" className="underline hover:text-ink">
            Privacy
          </Link>{" "}
          ·{" "}
          <Link to="/" className="underline hover:text-ink">
            Back to the church website
          </Link>
        </p>
      </main>
      <aside className="relative hidden overflow-hidden bg-forest-900 lg:block" aria-hidden="true">
        <div className="absolute -top-24 -right-24 size-96 rounded-full bg-marigold-500/90 blur-[2px]" />
        <div className="arch absolute bottom-0 left-1/2 h-[28rem] w-80 -translate-x-1/2 border border-paper/20 bg-forest-800" />
        <div className="arch absolute bottom-0 left-1/2 h-80 w-56 -translate-x-1/2 border border-paper/20 bg-forest-700" />
        <div className="arch absolute bottom-0 left-1/2 h-48 w-32 -translate-x-1/2 bg-forest-950" />
        <div className="absolute inset-x-12 top-1/3 text-paper">
          <p className="eyebrow !text-marigold-400">Kitisuru SDA Church</p>
          <p className="mt-3 max-w-sm font-display text-3xl leading-snug">
            One family, one register, one place to stay connected.
          </p>
        </div>
      </aside>
    </div>
  );
}

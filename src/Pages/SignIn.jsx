import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { googleLogin, login } from "../Api";
import { errorMessage } from "../Api/client";
import { useUser } from "../Context/UserContext";
import { googleEnabled, googleSignIn } from "../firebase";
import { LoaderCircle, CircleAlert } from "lucide-react";

export default function SignIn() {
  const navigate = useNavigate();
  const { signIn } = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  // Both ways of signing in end the same way: keep the tokens, open the dashboard.
  const finish = (session) => {
    signIn(session);
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
          <h1 className="text-4xl font-semibold">Welcome back</h1>
          <p className="mt-2 text-muted">Sign in to the church dashboard.</p>
          <div className="mt-8">
            <meta name="robots" content="noindex" />
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium">
                    Email or username <span className="text-clay-600">*</span>
                  </span>
                  <input
                    className="input"
                    required
                    type="text"
                    inputMode="email"
                    autoComplete="username"
                    autoCapitalize="none"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </label>
              </div>
              <div>
                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium">
                    Password <span className="text-clay-600">*</span>
                  </span>
                  <input
                    className="input"
                    required
                    type="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </label>
              </div>
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
                Sign in
              </button>
            </form>
            {googleEnabled && (
              <>
                <p className="my-4 text-center text-sm text-muted">or</p>
                <button
                  type="button"
                  className="inline-flex items-center justify-center gap-2 rounded-full font-semibold transition active:translate-y-px disabled:opacity-60 border border-line bg-white text-ink hover:border-forest-600 hover:text-forest-800 px-6 py-3.5 text-base w-full"
                  disabled={busy}
                  onClick={handleGoogle}
                >
                  Continue with Google
                </button>
              </>
            )}
            <p className="mt-6 text-center text-sm text-muted">
              New here?{" "}
              <Link to="/join" className="font-medium text-forest-700 underline">
                Create an account
              </Link>
            </p>
          </div>
          <div className="mt-6 text-center text-sm text-muted">
            <Link to="/forgot-password" className="font-medium text-forest-700 underline">
              Forgot your password?
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

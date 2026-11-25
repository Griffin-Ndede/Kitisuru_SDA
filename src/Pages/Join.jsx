import React, { useState, useId } from "react";
import { Link, useNavigate } from "react-router";
import { register } from "../Api";
import { errorMessage, saveSession } from "../Api/client";
import { LoaderCircle, CircleAlert } from "lucide-react";

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
    </AuthLayout>
  );
}

// ---- Small UI pieces used only on this page ----

// The arch-and-sunrise mark with the church name. `tone` flips it for dark backgrounds.
function Logo({ to = "/", tone = "dark", compact = false }) {
  const text = tone === "light" ? "text-paper" : "text-forest-900";
  return (
    <Link to={to} className={`inline-flex items-center gap-2.5 ${text}`} aria-label="Kitisuru SDA Church, home">
      <svg viewBox="0 0 32 32" className="size-9 shrink-0" aria-hidden="true">
        <rect width="32" height="32" rx="9" className={tone === "light" ? "fill-paper/10" : "fill-forest-900"} />
        <path d="M9 25V15a7 7 0 0 1 14 0v10" fill="none" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" />
        <circle cx="16" cy="19" r="3.4" fill="#FFC700" />
      </svg>
      {!compact && (
        <span className="leading-none">
          <span className="block font-display text-lg font-semibold tracking-tight">Kitisuru</span>
          <span className="block text-[0.65rem] font-semibold uppercase tracking-[0.2em] opacity-70">SDA Church</span>
        </span>
      )}
    </Link>
  );
}

// Sign-in pages: the form on paper, with a green brand panel beside it on large screens.
function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="app-theme grid min-h-screen lg:grid-cols-2">
      <main className="flex flex-col px-6 py-8 sm:px-12">
        <Logo />
        <div className="rise mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-10">
          <h1 className="text-4xl font-semibold">{title}</h1>
          {subtitle && <p className="mt-2 text-muted">{subtitle}</p>}
          <div className="mt-8">{children}</div>
          {footer && <div className="mt-6 text-center text-sm text-muted">{footer}</div>}
        </div>
        <p className="text-center text-xs text-muted">
          <Link to="/privacy" className="underline hover:text-ink">Privacy</Link> · <Link to="/" className="underline hover:text-ink">Back to the church website</Link>
        </p>
      </main>

      <aside className="relative hidden overflow-hidden bg-forest-900 lg:block" aria-hidden="true">
        <div className="absolute -top-24 -right-24 size-96 rounded-full bg-marigold-500/90 blur-[2px]" />
        <div className="arch absolute bottom-0 left-1/2 h-[28rem] w-80 -translate-x-1/2 border border-paper/20 bg-forest-800" />
        <div className="arch absolute bottom-0 left-1/2 h-80 w-56 -translate-x-1/2 border border-paper/20 bg-forest-700" />
        <div className="arch absolute bottom-0 left-1/2 h-48 w-32 -translate-x-1/2 bg-forest-950" />
        <div className="absolute inset-x-12 top-1/3 text-paper">
          <p className="eyebrow !text-marigold-400">Kitisuru SDA Church</p>
          <p className="mt-3 max-w-sm font-display text-3xl leading-snug">One family, one register, one place to stay connected.</p>
        </div>
      </aside>
    </div>
  );
}

const VARIANTS = {
  primary: "bg-forest-900 text-paper hover:bg-forest-800 shadow-card",
  accent: "bg-marigold-500 text-forest-950 hover:bg-marigold-400 shadow-card",
  secondary: "border border-line bg-white text-ink hover:border-forest-600 hover:text-forest-800",
  ghost: "text-forest-800 hover:bg-forest-50",
  danger: "bg-clay-600 text-white hover:bg-clay-700",
};

const SIZES = { sm: "px-3 py-1.5 text-sm", md: "px-4 py-2.5 text-sm", lg: "px-6 py-3.5 text-base" };

// Renders a <button>, a router <Link> (`to`) or an <a> (`href`) with one look.
function Button({ variant = "primary", size = "md", to, href, loading, icon: Icon, className = "", children, ...props }) {
  const classes = `inline-flex items-center justify-center gap-2 rounded-full font-semibold transition
    active:translate-y-px disabled:opacity-60 ${VARIANTS[variant]} ${SIZES[size]} ${className}`;
  const content = (
    <>
      {loading ? <LoaderCircle className="size-4 animate-spin" /> : Icon ? <Icon className="size-4" /> : null}
      {children}
    </>
  );
  if (to) return <Link to={to} className={classes} {...props}>{content}</Link>;
  if (href) return <a href={href} className={classes} {...props}>{content}</a>;
  return <button type="button" className={classes} disabled={loading || props.disabled} {...props}>{content}</button>;
}

// Label, hint and error wrapper shared by every input type.
function Field({ id, label, hint, error, required, children, className = "" }) {
  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} className="mb-1.5 block text-sm font-medium">
          {label}{required && <span className="text-clay-600"> *</span>}
        </label>
      )}
      {children}
      {error ? <p id={`${id}-error`} className="mt-1.5 text-xs font-medium text-clay-600">{error}</p>
        : hint ? <p className="mt-1.5 text-xs text-muted">{hint}</p> : null}
    </div>
  );
}

const describe = (id, error) => ({ id, "aria-invalid": Boolean(error), "aria-describedby": error ? `${id}-error` : undefined });

function Input({ label, hint, error, className, required, ...props }) {
  const id = useId();
  return (
    <Field id={id} label={label} hint={hint} error={error} required={required} className={className}>
      <input className={`input ${error ? "input-error" : ""}`} required={required} {...describe(id, error)} {...props} />
    </Field>
  );
}

function Checkbox({ label, hint, checked, onChange, name, required }) {
  const id = useId();
  return (
    <label htmlFor={id} className="flex items-start gap-3 text-sm">
      <input id={id} name={name} type="checkbox" required={required} checked={Boolean(checked)} onChange={onChange} className="mt-0.5 size-4 rounded accent-forest-700" />
      <span><span className="font-medium">{label}</span>{hint && <span className="block text-xs text-muted">{hint}</span>}</span>
    </label>
  );
}

// A banner for an error next to a form.
function FormError({ children }) {
  if (!children) return null;
  return (
    <p role="alert" className="flex items-start gap-2 rounded-xl bg-clay-100 px-3.5 py-2.5 text-sm text-clay-700">
      <CircleAlert className="mt-0.5 size-4 shrink-0" />{children}
    </p>
  );
}

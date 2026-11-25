import React, { useState, useId } from "react";
import { useNavigate, useRevalidator, useRouteLoaderData, Link } from "react-router";
import { deleteMyAccount, downloadMyData, updateMe } from "../../Api";
import { clearSession, errorMessage } from "../../Api/client";
import { Download, Save, Trash2, LoaderCircle, CircleAlert } from "lucide-react";
import { useToast } from "../../Context/ToastContext";
import { googleSignOut } from "../../firebase";

// Members add and correct their own details here. The email is their sign-in
// name, so it is shown but not editable.
export default function Profile() {
  const { user } = useRouteLoaderData("dashboard");
  const revalidator = useRevalidator();
  const toast = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    first_name: user.first_name,
    last_name: user.last_name,
    phone: user.phone || "",
    gender: user.gender || "",
    date_of_birth: user.date_of_birth || "",
    address: user.address || "",
  });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [confirmEmail, setConfirmEmail] = useState("");
  const [deleteError, setDeleteError] = useState("");

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await updateMe({ ...form, date_of_birth: form.date_of_birth || null });
      toast.success("Your details are saved");
      revalidator.revalidate();
    } catch (err) {
      setError(errorMessage(err));
    }
    setBusy(false);
  };

  const handleDownload = async () => {
    setError("");
    try {
      await downloadMyData();
    } catch (err) {
      setError(errorMessage(err));
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    setDeleteError("");
    try {
      await deleteMyAccount(confirmEmail);
      clearSession();
      await googleSignOut();
      navigate("/");
    } catch (err) {
      setDeleteError(errorMessage(err));
    }
  };

  return (
    <div>
      <PageHeader
        title="My profile"
        description="Keep your details up to date so the church office can reach you. Only you and the church admins can see them."
        actions={<a href="/privacy" target="_blank" rel="noreferrer" className="text-sm font-medium text-forest-700 underline">How we use your details</a>}
      />

      <Card as="form" onSubmit={handleSave} className="grid gap-4 sm:grid-cols-2">
        <Input label="First name" name="first_name" value={form.first_name} onChange={change} required />
        <Input label="Last name" name="last_name" value={form.last_name} onChange={change} required />
        <Input label="Email (your sign-in name)" value={user.email || "—"} readOnly disabled />
        <Input label="Phone number" type="tel" name="phone" value={form.phone} onChange={change} placeholder="0712 345 678" />
        <Select label="Gender" name="gender" value={form.gender} onChange={change} placeholder="Choose…"
          options={[{ value: "male", label: "Male" }, { value: "female", label: "Female" }]} />
        <Input label="Date of birth" type="date" name="date_of_birth" value={form.date_of_birth}
          onChange={change} max={new Date().toISOString().slice(0, 10)} />
        <Input className="sm:col-span-2" label="Address" hint="The estate or area where you live" name="address" value={form.address} onChange={change} />
        <div className="flex flex-wrap items-center gap-4 sm:col-span-2">
          <Button type="submit" icon={Save} loading={busy}>Save my details</Button>
          <FormError>{error}</FormError>
        </div>
      </Card>

      {(user.clusters.length > 0 || user.ministries.length > 0) && (
        <Card className="mt-6">
          <h2 className="text-xl font-semibold">Your groups and ministries</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {user.ministries.map((m) => <Badge key={`m${m.id}`} tone="gold">{m.title}</Badge>)}
            {user.clusters.map((c) => <Badge key={`c${c.id}`} tone="green">{c.name}</Badge>)}
          </div>
          <p className="mt-3 text-sm text-muted">The church office adds you to groups and ministries.</p>
        </Card>
      )}

      <Card className="mt-6">
        <h2 className="text-xl font-semibold">Your data</h2>
        <p className="mt-1 mb-4 text-sm text-muted">You can keep a copy of everything the church holds about you, or have it removed.</p>
        <Button variant="secondary" icon={Download} onClick={handleDownload}>Download my details</Button>

        <form onSubmit={handleDelete} className="mt-6 border-t border-line pt-5">
          <h3 className="text-lg font-semibold text-clay-700">Delete my account</h3>
          <p className="mt-1 mb-3 text-sm text-muted">
            This removes your account and details from the church dashboard. It cannot be undone.
            Type your email address ({user.email || user.first_name}) to confirm.
          </p>
          <div className="flex flex-wrap items-end gap-3">
            <input className="input min-w-60 flex-1" value={confirmEmail} onChange={(e) => setConfirmEmail(e.target.value)}
              placeholder="Your email address" aria-label="Type your email to confirm" />
            <Button type="submit" variant="danger" icon={Trash2} disabled={!confirmEmail}>Delete my account</Button>
          </div>
          {deleteError && <div className="mt-3"><FormError>{deleteError}</FormError></div>}
        </form>
      </Card>
    </div>
  );
}

// ---- Small UI pieces used only on this page ----

function Card({ as: Tag = "div", padded = true, className = "", children, ...props }) {
  return (
    <Tag className={`rounded-card border border-line bg-white shadow-card ${padded ? "p-5 sm:p-6" : ""} ${className}`} {...props}>
      {children}
    </Tag>
  );
}

function PageHeader({ title, description, actions }) {
  return (
    <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-3xl font-semibold sm:text-4xl">{title}</h1>
        {description && <p className="mt-1.5 max-w-2xl text-muted">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </header>
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

const TONES = {
  green: "bg-forest-100 text-forest-800",
  gold: "bg-marigold-100 text-marigold-600",
  clay: "bg-clay-100 text-clay-700",
  grey: "bg-paper-deep text-muted",
};

function Badge({ tone = "grey", children }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${TONES[tone]}`}>
      {children}
    </span>
  );
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

// options: [{ value, label }]
function Select({ label, hint, error, className, required, options = [], placeholder, ...props }) {
  const id = useId();
  return (
    <Field id={id} label={label} hint={hint} error={error} required={required} className={className}>
      <select className={`input ${error ? "input-error" : ""}`} required={required} {...describe(id, error)} {...props}>
        {placeholder !== undefined && <option value="">{placeholder}</option>}
        {options.map(({ value, label: text }) => <option key={value} value={value}>{text}</option>)}
      </select>
    </Field>
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

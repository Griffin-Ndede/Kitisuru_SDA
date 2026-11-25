import React, { useState, useId } from "react";
import { createAnnouncement, updateAnnouncement } from "../../Api";
import { errorMessage } from "../../Api/client";
import { useToast } from "../../Context/ToastContext";
import { LoaderCircle, CircleAlert } from "lucide-react";
import { Link } from "react-router";

// Post an announcement, or change one. `announcement` is null when posting.
export default function AnnouncementForm({ announcement, onSaved, onClose }) {
  const toast = useToast();
  const [form, setForm] = useState({
    title: announcement?.title || "",
    body: announcement?.body || "",
    pinned: announcement?.pinned || false,
    expires_on: announcement?.expires_on || "",
  });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const details = { ...form, expires_on: form.expires_on || null };
      await (announcement ? updateAnnouncement(announcement.id, details) : createAnnouncement(details));
      toast.success(announcement ? "Announcement saved" : "Announcement posted");
      onSaved();
    } catch (err) {
      setError(errorMessage(err));
      setBusy(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input label="Title" name="title" value={form.title} onChange={change} required />
      <div>
        <label htmlFor="body" className="mb-1.5 block text-sm font-medium">Message <span className="text-clay-600">*</span></label>
        <textarea id="body" name="body" className="input min-h-32" value={form.body} onChange={change} required />
      </div>
      <Input label="Show until" type="date" name="expires_on" value={form.expires_on} onChange={change}
        hint="Optional. Members stop seeing it after this day." />
      <Checkbox label="Pin to the top" hint="Pinned announcements stay above the rest."
        checked={form.pinned} onChange={(e) => setForm({ ...form, pinned: e.target.checked })} />
      <FormError>{error}</FormError>
      <div className="flex gap-3">
        <Button type="submit" loading={busy}>{announcement ? "Save changes" : "Post"}</Button>
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
      </div>
    </form>
  );
}

// ---- Small UI pieces used only on this page ----

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

function Checkbox({ label, hint, checked, onChange, name, required }) {
  const id = useId();
  return (
    <label htmlFor={id} className="flex items-start gap-3 text-sm">
      <input id={id} name={name} type="checkbox" required={required} checked={Boolean(checked)} onChange={onChange} className="mt-0.5 size-4 rounded accent-forest-700" />
      <span><span className="font-medium">{label}</span>{hint && <span className="block text-xs text-muted">{hint}</span>}</span>
    </label>
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

// A banner for an error next to a form.
function FormError({ children }) {
  if (!children) return null;
  return (
    <p role="alert" className="flex items-start gap-2 rounded-xl bg-clay-100 px-3.5 py-2.5 text-sm text-clay-700">
      <CircleAlert className="mt-0.5 size-4 shrink-0" />{children}
    </p>
  );
}

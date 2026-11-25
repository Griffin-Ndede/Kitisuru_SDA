import React, { useState, useId } from "react";
import { addRequestToRegister } from "../../Api";
import { errorMessage } from "../../Api/client";
import { useToast } from "../../Context/ToastContext";
import { kindLabels } from "./memberHelpers";
import { LoaderCircle, CircleAlert } from "lucide-react";
import { Link } from "react-router";

// Choose the ministries and clusters for a person who sent a Get involved form,
// then add them to the member register. The ministries they asked for are ticked.
export default function AddToRegisterDialog({ request, ministries, clusters, onSaved, onClose }) {
  const toast = useToast();
  const [chosen, setChosen] = useState({
    ministries: request.ministries.map((m) => m.id),
    clusters: [],
  });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const toggle = (field, id) =>
    setChosen({
      ...chosen,
      [field]: chosen[field].includes(id) ? chosen[field].filter((x) => x !== id) : [...chosen[field], id],
    });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const result = await addRequestToRegister(request.id, chosen);
      toast.success(
        result.already_in_register
          ? `${request.name} is already in the register. Added to the groups`
          : `${request.name} added to the register`
      );
      onSaved();
    } catch (err) {
      setError(errorMessage(err));
      setBusy(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 text-sm">
      <p className="text-muted">
        {request.name} will be added to the church register (or found there, if they are already in it by email or
        phone). They can sign in later by registering with the same email.
      </p>

      <fieldset>
        <legend className="mb-2 font-medium">Ministries</legend>
        {ministries.length === 0 ? <p className="text-muted">No ministries yet.</p> : (
          <div className="grid gap-2 sm:grid-cols-2">
            {ministries.map((m) => (
              <Checkbox key={m.id} label={m.title} checked={chosen.ministries.includes(m.id)} onChange={() => toggle("ministries", m.id)} />
            ))}
          </div>
        )}
      </fieldset>

      <fieldset>
        <legend className="mb-1 font-medium">Clusters</legend>
        {request.area && <p className="mb-2 text-muted">They said they live in <strong className="text-ink">{request.area}</strong>.</p>}
        {clusters.length === 0 ? <p className="text-muted">No clusters yet. Create them on the Clusters page.</p> : (
          <div className="grid gap-2 sm:grid-cols-2">
            {clusters.map((c) => (
              <Checkbox key={c.id} label={c.name} hint={kindLabels[c.kind]} checked={chosen.clusters.includes(c.id)} onChange={() => toggle("clusters", c.id)} />
            ))}
          </div>
        )}
      </fieldset>

      <FormError>{error}</FormError>
      <div className="flex gap-3">
        <Button type="submit" loading={busy}>Add to the register</Button>
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

// A banner for an error next to a form.
function FormError({ children }) {
  if (!children) return null;
  return (
    <p role="alert" className="flex items-start gap-2 rounded-xl bg-clay-100 px-3.5 py-2.5 text-sm text-clay-700">
      <CircleAlert className="mt-0.5 size-4 shrink-0" />{children}
    </p>
  );
}

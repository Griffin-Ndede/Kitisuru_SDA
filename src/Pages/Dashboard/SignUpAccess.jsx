import React, { useState, useId } from "react";
import { useLoaderData, useRevalidator, Link } from "react-router";
import {
  inviteUser,
  updateUser,
} from "../../Api";
import { errorMessage } from "../../Api/client";
import { Check, Link2, MessageCircle, Send, X, LoaderCircle, CircleAlert } from "lucide-react";
import { useToast } from "../../Context/ToastContext";
import CopyLink from "./CopyLink";
import { roleLabels } from "./roles";

const emptyForm = { email: "", first_name: "", last_name: "", role: "member" };

const whatsappShare = (link) =>
  "https://wa.me/?text=" +
  encodeURIComponent(`Join the Kitisuru SDA Church family online. Sign up here: ${link}`);

const fullName = (p) => `${p.first_name} ${p.last_name}`.trim() || "—";

// Admin only: the shared sign-up link, people waiting for approval, and
// individual invitations. Everyone else is managed on the Members page.
export default function SignUpAccess() {
  const { people } = useLoaderData();
  const signupLink = `${window.location.origin}/join`;
  const revalidator = useRevalidator();
  const [form, setForm] = useState(emptyForm);
  const toast = useToast();
  // The link to send by hand after inviting someone one-to-one.
  const [invite, setInvite] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // Runs an action, shows its result, then reloads the list.
  const run = async (action, success) => {
    setError("");
    setInvite(null);
    setBusy(true);
    try {
      const result = await action();
      toast.success(success);
      if (result?.invite_link) setInvite(result);
      revalidator.revalidate();
      return true;
    } catch (err) {
      setError(errorMessage(err));
      return false;
    } finally {
      setBusy(false);
    }
  };

  const handleInvite = async (e) => {
    e.preventDefault();
    const sent = await run(() => inviteUser(form), `${form.email} is invited`);
    if (sent) setForm(emptyForm);
  };

  const waiting = people.filter((p) => !p.approved && p.is_active);
  return (
    <div>
      <PageHeader title="Sign-up & invitations" description="How people join the dashboard, and who is waiting for you to approve them." />
      <div className="mb-4"><FormError>{error}</FormError></div>

      <Card className="mb-6">
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-full bg-forest-50 text-forest-700"><Link2 className="size-5" /></span>
          <h2 className="text-xl font-semibold">Sign-up page</h2>
          <Badge tone="green">Open to everyone</Badge>
        </div>
        <p className="mt-2 mb-4 text-sm text-muted">
          People create their own account on the Sign in page (&ldquo;Create an account&rdquo;), with an email and password, and then wait here for your approval. This link opens the same page. It is only a backup you can post in the church WhatsApp group.
        </p>
        <CopyLink link={signupLink}>
          <Button size="sm" variant="secondary" icon={MessageCircle} href={whatsappShare(signupLink)} target="_blank" rel="noreferrer">
            Share on WhatsApp
          </Button>
        </CopyLink>
      </Card>

      {waiting.length > 0 && (
        <Card className="mb-6 !border-marigold-400/50 !bg-marigold-100/50">
          <h2 className="mb-2 text-xl font-semibold">Waiting for approval ({waiting.length})</h2>
          <ul className="divide-y divide-marigold-400/30">
            {waiting.map((person) => (
              <li key={person.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                <span className="flex items-center gap-3">
                  <Avatar name={fullName(person)} size="sm" />
                  <span>
                    <span className="block text-sm font-semibold">{fullName(person)}</span>
                    <span className="block text-xs text-muted">{person.email} · {person.phone || "no phone"}</span>
                  </span>
                </span>
                <span className="flex gap-2">
                  <Button size="sm" icon={Check} disabled={busy} onClick={() => run(() => updateUser(person.id, { approved: true }), `${fullName(person)} approved`)}>
                    Approve
                  </Button>
                  <Button size="sm" variant="ghost" icon={X} disabled={busy} onClick={() => run(() => updateUser(person.id, { is_active: false }), `${fullName(person)}'s account switched off`)}>
                    Reject
                  </Button>
                </span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      <Card as="form" onSubmit={handleInvite} className="mb-6 grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <h2 className="text-xl font-semibold">Invite one person with a role</h2>
          <p className="mt-1 text-sm text-muted">
            For leaders and treasurers, or anyone who needs a role other than member. They are approved straight away.
          </p>
        </div>
        <Input label="First name" name="first_name" value={form.first_name} onChange={change} />
        <Input label="Last name" name="last_name" value={form.last_name} onChange={change} />
        <Input label="Email" type="email" name="email" value={form.email} onChange={change} required />
        <Select label="Role" name="role" value={form.role} onChange={change}
          options={Object.entries(roleLabels).map(([value, label]) => ({ value, label }))} />
        <div className="sm:col-span-2">
          <Button type="submit" icon={Send} loading={busy}>Create invitation</Button>
        </div>
      </Card>

      {invite && (
        <div role="status" className="mb-6 rounded-card bg-forest-50 p-5 text-sm">
          <p className="mb-3">
            {invite.email_sent
              ? `We emailed ${invite.email}. You can also send them this link yourself:`
              : `No email was sent. Send ${invite.email} this link yourself (WhatsApp, for example). It works for them only:`}
          </p>
          <CopyLink link={invite.invite_link} />
          <p className="mt-2 text-muted">The link works once and expires in 7 days.</p>
        </div>
      )}
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

const initials = (name = "") =>
  name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase()).join("") || "?";

function Avatar({ name, size = "md" }) {
  const sizes = { sm: "size-8 text-xs", md: "size-10 text-sm", lg: "size-16 text-xl" };
  return (
    <span className={`${sizes[size]} grid shrink-0 place-items-center rounded-full bg-forest-100 font-semibold text-forest-800`} aria-hidden="true">
      {initials(name)}
    </span>
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

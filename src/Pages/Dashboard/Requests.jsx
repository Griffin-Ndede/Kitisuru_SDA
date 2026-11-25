import React, { useMemo, useState, useEffect, useRef } from "react";
import { useLoaderData, useRevalidator, Link } from "react-router";
import { Check, HandHeart, Mail, MapPin, Phone, RotateCcw, UserPlus, X, LoaderCircle, Inbox, CircleAlert } from "lucide-react";
import { updateRequest } from "../../Api";
import { errorMessage } from "../../Api/client";
import { useToast } from "../../Context/ToastContext";
import AddToRegisterDialog from "./AddToRegisterDialog";
import { formatDate } from "./ministryHelpers";

const tabs = [
  { value: "new", label: "New" },
  { value: "done", label: "Done" },
  { value: "dismissed", label: "Dismissed" },
  { value: "all", label: "All" },
];
const statusTone = { new: "gold", done: "green", dismissed: "grey" };
const statusLabel = { new: "New", done: "Done", dismissed: "Dismissed" };

// Admin only: what people sent through the Get involved page. Adding someone
// puts them in the member register and the ministries and clusters chosen here.
export default function Requests() {
  const { requests, clusters, ministries } = useLoaderData();
  const revalidator = useRevalidator();
  const toast = useToast();
  const [tab, setTab] = useState("new");
  const [adding, setAdding] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const shown = useMemo(() => requests.filter((r) => tab === "all" || r.status === tab), [requests, tab]);
  const count = (value) => (value === "all" ? requests.length : requests.filter((r) => r.status === value).length);

  const setStatus = async (request, status, message) => {
    setError("");
    setBusy(true);
    try {
      await updateRequest(request.id, { status });
      toast.success(message);
      revalidator.revalidate();
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Get involved requests"
        description="What people sent through the Get involved page. Add them to the register and their ministries and clusters, or mark them done."
      />
      <div className="mb-4"><FormError>{error}</FormError></div>

      <div role="tablist" className="mb-5 flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.value} type="button" role="tab" aria-selected={tab === t.value} onClick={() => setTab(t.value)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${tab === t.value ? "bg-forest-900 text-white" : "bg-white text-muted ring-1 ring-line hover:text-ink"}`}
          >
            {t.label} <span className="opacity-70">({count(t.value)})</span>
          </button>
        ))}
      </div>

      {shown.length === 0 ? (
        <Card><EmptyState icon={HandHeart} title="Nothing here">New requests from the Get involved page will appear here.</EmptyState></Card>
      ) : (
        <ul className="space-y-4">
          {shown.map((r) => (
            <li key={r.id}>
              <Card>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-xl font-semibold">{r.name}</h2>
                      <Badge tone="green">{r.kind_label}</Badge>
                      <Badge tone={statusTone[r.status]}>{statusLabel[r.status]}</Badge>
                    </div>
                    <p className="mt-1 text-xs text-muted">Sent {formatDate(r.created_at)}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {r.can_add_member && (
                      <Button size="sm" icon={UserPlus} disabled={busy} onClick={() => setAdding(r)}>Add to register</Button>
                    )}
                    {r.status === "new" ? (
                      <>
                        <Button size="sm" variant="secondary" icon={Check} disabled={busy} onClick={() => setStatus(r, "done", "Marked done")}>Mark done</Button>
                        <Button size="sm" variant="ghost" icon={X} disabled={busy} onClick={() => setStatus(r, "dismissed", "Dismissed")}>Dismiss</Button>
                      </>
                    ) : (
                      <Button size="sm" variant="ghost" icon={RotateCcw} disabled={busy} onClick={() => setStatus(r, "new", "Moved back to new")}>Reopen</Button>
                    )}
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm text-forest-800">
                  {r.phone && <a href={`tel:${r.phone}`} className="inline-flex items-center gap-1.5"><Phone className="size-3.5" />{r.phone}</a>}
                  {r.email && <a href={`mailto:${r.email}`} className="inline-flex items-center gap-1.5 break-all"><Mail className="size-3.5" />{r.email}</a>}
                  {r.area && <span className="inline-flex items-center gap-1.5 text-muted"><MapPin className="size-3.5" />{r.area}</span>}
                </div>

                {r.ministries.length > 0 && (
                  <p className="mt-3 flex flex-wrap items-center gap-2 text-sm">
                    <span className="text-muted">Wants to join</span>
                    {r.ministries.map((m) => <Badge key={m.id} tone="gold">{m.title}</Badge>)}
                  </p>
                )}
                {r.member && <p className="mt-3 text-sm font-medium text-forest-700">In the register as {r.member.name}.</p>}

                {r.details.length > 0 && (
                  <details className="mt-3 text-sm">
                    <summary className="cursor-pointer font-medium text-forest-800">Their answers</summary>
                    <dl className="mt-2 space-y-2 rounded-xl bg-paper p-4">
                      {r.details.map((d) => (
                        <div key={d.label}>
                          <dt className="text-xs text-muted">{d.label}</dt>
                          <dd className="whitespace-pre-line">{d.value}</dd>
                        </div>
                      ))}
                    </dl>
                  </details>
                )}
              </Card>
            </li>
          ))}
        </ul>
      )}

      {adding && (
        <Modal title={`Add ${adding.name}`} onClose={() => setAdding(null)}>
          <AddToRegisterDialog
            request={adding} ministries={ministries} clusters={clusters}
            onClose={() => setAdding(null)}
            onSaved={() => { setAdding(null); revalidator.revalidate(); }}
          />
        </Modal>
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

// A box over a dimmed page (a bottom sheet on phones). Escape or a click outside closes it.
function Modal({ title, description, size = "md", onClose, children }) {
  const panel = useRef(null);

  useEffect(() => {
    const onKey = (event) => event.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    panel.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const width = { sm: "sm:max-w-md", md: "sm:max-w-xl", lg: "sm:max-w-3xl", xl: "sm:max-w-6xl" }[size];

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6">
      <div className="absolute inset-0 bg-forest-950/50 backdrop-blur-[2px]" onClick={onClose} aria-hidden="true" />
      <div
        ref={panel} tabIndex={-1} role="dialog" aria-modal="true" aria-label={title}
        className={`rise relative flex max-h-[92vh] w-full flex-col rounded-t-3xl bg-white shadow-lift outline-none sm:rounded-3xl ${width}`}
      >
        <header className="flex items-start justify-between gap-4 border-b border-line px-5 py-4 sm:px-6">
          <div>
            <h2 className="text-xl font-semibold">{title}</h2>
            {description && <p className="mt-0.5 text-sm text-muted">{description}</p>}
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="rounded-full p-1.5 text-muted hover:bg-paper-deep hover:text-ink">
            <X className="size-5" />
          </button>
        </header>
        <div className="overflow-y-auto px-5 py-5 sm:px-6">{children}</div>
      </div>
    </div>
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

function EmptyState({ icon: Icon = Inbox, title, children, action }) {
  return (
    <div className="flex flex-col items-center px-6 py-12 text-center">
      <span className="arch grid h-16 w-14 place-items-center bg-forest-50 text-forest-600"><Icon className="size-6" /></span>
      <h3 className="mt-4 text-lg font-semibold">{title}</h3>
      {children && <p className="mt-1 max-w-sm text-sm text-muted">{children}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
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

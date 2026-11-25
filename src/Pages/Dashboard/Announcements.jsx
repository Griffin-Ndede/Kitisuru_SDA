import React, { useState, useEffect, useRef } from "react";
import { useLoaderData, useRevalidator, useRouteLoaderData, Link } from "react-router";
import { Megaphone, Pencil, Pin, Plus, Trash2, LoaderCircle, X, Inbox, CircleAlert } from "lucide-react";
import { deleteAnnouncement } from "../../Api";
import { errorMessage } from "../../Api/client";
import { useToast } from "../../Context/ToastContext";
import AnnouncementForm from "./AnnouncementForm";
import { formatDate } from "./ministryHelpers";

// What the church office wants every member to know. Everyone approved reads;
// admins post, edit and remove.
export default function Announcements() {
  const { announcements } = useLoaderData();
  const { user } = useRouteLoaderData("dashboard");
  const revalidator = useRevalidator();
  const toast = useToast();
  const [dialog, setDialog] = useState(null); // "new" or an announcement
  const [error, setError] = useState("");

  const isAdmin = user.role === "admin";

  const handleDelete = async (item) => {
    if (!window.confirm(`Remove "${item.title}"?`)) return;
    setError("");
    try {
      await deleteAnnouncement(item.id);
      toast.success("Announcement removed");
      revalidator.revalidate();
    } catch (err) {
      setError(errorMessage(err));
    }
  };

  const saved = () => {
    setDialog(null);
    revalidator.revalidate();
  };

  return (
    <div>
      <PageHeader
        title="Announcements"
        description="News and notices from the church office."
        actions={isAdmin && <Button icon={Plus} onClick={() => setDialog("new")}>New announcement</Button>}
      />
      <div className="mb-4"><FormError>{error}</FormError></div>

      {announcements.length === 0 ? (
        <Card><EmptyState icon={Megaphone} title="No announcements right now">Check back soon.</EmptyState></Card>
      ) : (
        <ul className="space-y-4">
          {announcements.map((item) => (
            <li key={item.id}>
              <Card className={item.pinned ? "!border-marigold-400" : ""}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-xl font-semibold">{item.title}</h2>
                      {item.pinned && <Badge tone="gold"><Pin className="mr-1 size-3" />Pinned</Badge>}
                      {item.is_expired && <Badge tone="grey">Expired</Badge>}
                    </div>
                    <p className="mt-1 text-xs text-muted">
                      {formatDate(item.created_at)}{item.author_name && ` · ${item.author_name}`}
                      {item.expires_on && ` · shown until ${formatDate(item.expires_on)}`}
                    </p>
                  </div>
                  {isAdmin && (
                    <div className="flex gap-2">
                      <Button size="sm" variant="secondary" icon={Pencil} onClick={() => setDialog(item)} aria-label={`Edit ${item.title}`}>Edit</Button>
                      <Button size="sm" variant="ghost" icon={Trash2} onClick={() => handleDelete(item)} aria-label={`Remove ${item.title}`} />
                    </div>
                  )}
                </div>
                <p className="mt-3 whitespace-pre-line leading-relaxed text-ink/90">{item.body}</p>
              </Card>
            </li>
          ))}
        </ul>
      )}

      {dialog && (
        <Modal title={dialog === "new" ? "New announcement" : "Edit announcement"} onClose={() => setDialog(null)}>
          <AnnouncementForm announcement={dialog === "new" ? null : dialog} onSaved={saved} onClose={() => setDialog(null)} />
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

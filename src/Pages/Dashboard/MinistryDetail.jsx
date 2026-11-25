import React, { useMemo, useState, useEffect, useRef } from "react";
import { Link, useLoaderData, useNavigate, useRevalidator } from "react-router";
import { ArrowLeft, Calendar, CircleCheck, Clock, HeartHandshake, Mail, MapPin, Pencil, Phone, Trash2, UserMinus, UserPlus, LoaderCircle, X, Search, CircleAlert } from "lucide-react";
import { changeMinistryMembers, deleteMinistry } from "../../Api";
import { errorMessage } from "../../Api/client";
import { useToast } from "../../Context/ToastContext";
import MinistryForm from "./MinistryForm";
import { formatDate, photoUrl } from "./ministryHelpers";
import { fullName, matchesSearch } from "./memberHelpers";

const Section = ({ title, children }) => (
  <section>
    <h2 className="mb-3 text-2xl font-semibold">{title}</h2>
    {children}
  </section>
);

// One ministry: what it is, its programs, events, photos and contact people.
// Admins also edit it and manage who belongs to it.
export default function MinistryDetail() {
  const { ministry, members } = useLoaderData();
  const revalidator = useRevalidator();
  const navigate = useNavigate();
  const toast = useToast();
  const [editing, setEditing] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const isAdmin = Boolean(ministry.members);
  const inMinistry = useMemo(() => new Set((ministry.members || []).map((m) => m.id)), [ministry]);
  const candidates = useMemo(
    () => (search.trim() ? members.filter((m) => !inMinistry.has(m.id) && matchesSearch(m, search)).slice(0, 8) : []),
    [members, inMinistry, search]
  );
  const events = [...(ministry.events || [])].sort((a, b) => new Date(a.start_date) - new Date(b.start_date));

  const run = async (action, success) => {
    setError("");
    setBusy(true);
    try {
      await action();
      toast.success(success);
      revalidator.revalidate();
      return true;
    } catch (err) {
      setError(errorMessage(err));
      return false;
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm(`Delete the ${ministry.title} ministry? The people in it stay in the register.`)) {
      if (await run(() => deleteMinistry(ministry.id), "Ministry deleted")) navigate("/dashboard/ministries");
    }
  };

  return (
    <div>
      <Link to="/dashboard/ministries" className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-forest-800 hover:underline">
        <ArrowLeft className="size-4" /> All ministries
      </Link>

      <header className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <span className="grid size-14 shrink-0 place-items-center rounded-full bg-forest-50 text-forest-700"><HeartHandshake className="size-7" /></span>
          <div>
            <h1 className="text-3xl font-semibold sm:text-4xl">{ministry.title}</h1>
            {ministry.mission && <p className="mt-1.5 max-w-2xl text-muted">{ministry.mission}</p>}
          </div>
        </div>
        {isAdmin && (
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" icon={Pencil} onClick={() => setEditing(true)}>Edit</Button>
            <Button variant="danger" size="sm" icon={Trash2} onClick={handleDelete} disabled={busy}>Delete</Button>
          </div>
        )}
      </header>
      <div className="mb-4"><FormError>{error}</FormError></div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <Section title="About us">
            <p className="max-w-2xl leading-relaxed text-ink/80">{ministry.description || "No description yet."}</p>
          </Section>

          <Section title="Programs">
            {ministry.programs.length === 0 ? (
              <p className="text-sm text-muted">No programs listed yet.</p>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {ministry.programs.map((p) => (
                  <Card key={p.id}>
                    <h3 className="text-lg font-semibold">{p.title}</h3>
                    <p className="mt-1 text-sm text-muted">{p.description}</p>
                    <p className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-forest-800"><Clock className="size-4" />{p.schedule}</p>
                  </Card>
                ))}
              </div>
            )}
          </Section>

          <Section title="Events">
            {events.length === 0 ? (
              <p className="text-sm text-muted">No events listed yet.</p>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {events.map((e) => (
                  <Card key={e.id}>
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-lg font-semibold">{e.title}</h3>
                      {new Date(e.end_date) < new Date() && <CircleCheck className="size-5 shrink-0 text-forest-600" aria-label="Past event" />}
                    </div>
                    <p className="mt-1 text-sm text-muted">{e.description}</p>
                    <p className="mt-3 flex items-center gap-1.5 text-sm text-forest-800"><MapPin className="size-4" />{e.location}</p>
                    <p className="mt-1 flex items-center gap-1.5 text-sm text-forest-800"><Calendar className="size-4" />{formatDate(e.start_date)} to {formatDate(e.end_date)}</p>
                  </Card>
                ))}
              </div>
            )}
          </Section>

          {ministry.gallery_images.length > 0 && (
            <Section title="Photos">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {ministry.gallery_images.map((g, i) => (
                  <button key={g.id ?? i} type="button" onClick={() => setPhoto(photoUrl(g.image))} className="overflow-hidden rounded-2xl">
                    <img src={photoUrl(g.image)} alt={`${ministry.title} photo ${i + 1}`} loading="lazy" className="aspect-square w-full object-cover transition hover:scale-105" />
                  </button>
                ))}
              </div>
            </Section>
          )}
        </div>

        <aside className="space-y-6">
          <Card>
            <h2 className="mb-3 text-xl font-semibold">Get in touch</h2>
            {ministry.contacts.length === 0 ? (
              <p className="text-sm text-muted">No contact people listed yet.</p>
            ) : (
              <ul className="space-y-4">
                {ministry.contacts.map((c) => (
                  <li key={c.id} className="flex items-start gap-3">
                    <Avatar name={c.name} />
                    <div className="min-w-0 text-sm">
                      <p className="font-semibold">{c.name}</p>
                      {c.role && <p className="text-muted">{c.role}</p>}
                      {c.phone && <a href={`tel:${c.phone}`} className="mt-1 flex items-center gap-1.5 text-forest-800"><Phone className="size-3.5" />{c.phone}</a>}
                      {c.email && <a href={`mailto:${c.email}`} className="flex items-center gap-1.5 break-all text-forest-800"><Mail className="size-3.5" />{c.email}</a>}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          {isAdmin && (
            <Card>
              <h2 className="mb-3 text-xl font-semibold">Members ({ministry.members.length})</h2>
              <SearchInput value={search} onChange={setSearch} placeholder="Find someone to add" />
              {candidates.length > 0 && (
                <ul className="mt-2 divide-y divide-line/70 rounded-xl border border-line px-3">
                  {candidates.map((m) => (
                    <li key={m.id} className="flex items-center justify-between gap-2 py-2">
                      <span className="min-w-0 truncate text-sm">{fullName(m)}</span>
                      <Button size="sm" variant="secondary" icon={UserPlus} disabled={busy} aria-label={`Add ${fullName(m)}`}
                        onClick={() => run(() => changeMinistryMembers(ministry.id, { add: [m.id] }), `${fullName(m)} added`)}>Add</Button>
                    </li>
                  ))}
                </ul>
              )}
              {search.trim() && candidates.length === 0 && <p className="mt-2 text-sm text-muted">No one else matches.</p>}
              {ministry.members.length === 0 ? (
                <p className="mt-3 text-sm text-muted">No one yet.</p>
              ) : (
                <ul className="mt-3 divide-y divide-line/70">
                  {ministry.members.map((m) => (
                    <li key={m.id} className="flex items-center justify-between gap-2 py-2.5">
                      <span className="flex min-w-0 items-center gap-2.5">
                        <Avatar name={m.name} size="sm" />
                        <span className="min-w-0">
                          <span className="block truncate text-sm font-medium">{m.name}</span>
                          <span className="block truncate text-xs text-muted">{m.phone || m.email}</span>
                        </span>
                      </span>
                      <Button size="sm" variant="ghost" icon={UserMinus} disabled={busy} aria-label={`Remove ${m.name}`}
                        onClick={() => run(() => changeMinistryMembers(ministry.id, { remove: [m.id] }), `${m.name} removed`)} />
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          )}
        </aside>
      </div>

      {editing && (
        <Modal title={`Edit ${ministry.title}`} onClose={() => setEditing(false)}>
          <MinistryForm ministry={ministry} onClose={() => setEditing(false)} onSaved={() => { setEditing(false); revalidator.revalidate(); }} />
        </Modal>
      )}
      {photo && (
        <Modal title={ministry.title} size="lg" onClose={() => setPhoto(null)}>
          <img src={photo} alt="" className="mx-auto max-h-[70vh] rounded-xl object-contain" />
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

function SearchInput({ value, onChange, placeholder = "Search", className = "" }) {
  return (
    <div className={`relative ${className}`}>
      <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted" />
      <input type="search" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} aria-label={placeholder} className="input pl-10" />
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

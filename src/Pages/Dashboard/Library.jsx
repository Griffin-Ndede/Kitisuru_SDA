import React, { useMemo, useState, useEffect, useRef, useId } from "react";
import { useLoaderData, Link } from "react-router";
import { BookOpenText, FileText, LoaderCircle, X, Search, Inbox, CircleAlert } from "lucide-react";
import { getDocumentFileUrl } from "../../Api";
import { errorMessage } from "../../Api/client";
import { formatDate } from "./ministryHelpers";

// The church's study materials (PDFs), for every approved member.
export default function Library() {
  const { documents } = useLoaderData();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [open, setOpen] = useState(null); // { doc, url, error }

  const categories = useMemo(
    () => [...new Set(documents.map((d) => d.category?.name).filter(Boolean))].sort(),
    [documents]
  );
  const shown = useMemo(() => {
    const words = search.toLowerCase().split(/\s+/).filter(Boolean);
    return documents
      .filter((d) => !category || d.category?.name === category)
      .filter((d) => words.every((w) => `${d.title} ${d.description}`.toLowerCase().includes(w)))
      .sort((a, b) => a.title.localeCompare(b.title));
  }, [documents, search, category]);

  // The PDF needs the sign-in token, so it is fetched when someone opens it.
  const handleOpen = async (doc) => {
    setOpen({ doc, url: null, error: "" });
    try {
      setOpen({ doc, url: await getDocumentFileUrl(doc.slug), error: "" });
    } catch (err) {
      setOpen({ doc, url: null, error: errorMessage(err, "Could not open this document.") });
    }
  };

  const handleClose = () => {
    if (open?.url) URL.revokeObjectURL(open.url);
    setOpen(null);
  };

  return (
    <div>
      <PageHeader title="Library" description="Study materials and documents from the church." />

      <div className="mb-4 grid gap-3 sm:grid-cols-3">
        <SearchInput className="sm:col-span-2" value={search} onChange={setSearch} placeholder="Search the library" />
        <Select aria-label="Filter by category" value={category} onChange={(e) => setCategory(e.target.value)}
          placeholder="All categories" options={categories.map((c) => ({ value: c, label: c }))} />
      </div>
      <p className="mb-4 text-sm text-muted" aria-live="polite">Showing {shown.length} of {documents.length}</p>

      {shown.length === 0 ? (
        <Card><EmptyState icon={BookOpenText} title="Nothing found">Try a different search or category.</EmptyState></Card>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((doc) => (
            <Card key={doc.id} className="flex flex-col">
              <span className="grid size-10 place-items-center rounded-full bg-forest-50 text-forest-700"><FileText className="size-5" /></span>
              <h2 className="mt-3 text-lg font-semibold">{doc.title}</h2>
              <p className="mt-1 line-clamp-3 flex-1 text-sm text-muted">{doc.description}</p>
              <div className="mt-4 flex items-center justify-between gap-2">
                <span className="flex flex-wrap items-center gap-2 text-xs text-muted">
                  {doc.category?.name && <Badge tone="green">{doc.category.name}</Badge>}
                  {doc.publish_date && formatDate(doc.publish_date)}
                </span>
                <Button size="sm" onClick={() => handleOpen(doc)}>Read</Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {open && (
        <Modal title={open.doc.title} size="xl" onClose={handleClose}>
          {open.error ? <FormError>{open.error}</FormError>
            : !open.url ? <Spinner label="Opening" />
            : <iframe src={`${open.url}#toolbar=1&navpanes=0&zoom=page-width`} title={open.doc.title} className="h-[70vh] w-full rounded-xl border border-line" />}
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

function Spinner({ label = "Loading" }) {
  return (
    <div role="status" className="flex items-center justify-center gap-2 py-12 text-muted">
      <LoaderCircle className="size-5 animate-spin" /> <span className="text-sm">{label}</span>
    </div>
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

function SearchInput({ value, onChange, placeholder = "Search", className = "" }) {
  return (
    <div className={`relative ${className}`}>
      <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted" />
      <input type="search" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} aria-label={placeholder} className="input pl-10" />
    </div>
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

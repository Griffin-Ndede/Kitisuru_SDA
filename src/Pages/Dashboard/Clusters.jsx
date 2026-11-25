import React, { useMemo, useState, useId } from "react";
import { useLoaderData, useRevalidator, Link } from "react-router";
import { Pencil, Plus, Trash2, UserMinus, UserPlus, UsersRound, LoaderCircle, Search, Inbox, CircleAlert } from "lucide-react";
import { changeClusterMembers, createCluster, deleteCluster, updateCluster } from "../../Api";
import { errorMessage } from "../../Api/client";
import { useToast } from "../../Context/ToastContext";
import { fullName, kindLabels, matchesSearch, newKinds } from "./memberHelpers";

// One person in a list, with a button on the right.
function PersonRow({ person, action }) {
  return (
    <li className="flex items-center justify-between gap-3 py-2.5">
      <span className="flex min-w-0 items-center gap-3">
        <Avatar name={fullName(person)} size="sm" />
        <span className="min-w-0">
          <span className="block truncate text-sm font-medium">{fullName(person)}</span>
          <span className="block truncate text-xs text-muted">{person.phone || person.email}</span>
        </span>
      </span>
      {action}
    </li>
  );
}

// Admin only: location groups and fundraising groups, and who belongs to each.
export default function Clusters() {
  const { members, clusters } = useLoaderData();
  const revalidator = useRevalidator();
  const toast = useToast();
  const [selectedId, setSelectedId] = useState(clusters[0]?.id ?? null);
  const [form, setForm] = useState({ name: "", kind: "prayer_cell" });
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const selected = clusters.find((c) => c.id === selectedId) || null;
  const inCluster = useMemo(() => members.filter((m) => selected && m.clusters.includes(selected.id)), [members, selected]);
  const candidates = useMemo(
    () =>
      selected && search.trim()
        ? members.filter((m) => !m.clusters.includes(selected.id) && matchesSearch(m, search)).slice(0, 8)
        : [],
    [members, selected, search]
  );

  const run = async (action, success) => {
    setError("");
    setBusy(true);
    try {
      const result = await action();
      toast.success(success);
      revalidator.revalidate();
      return result ?? true;
    } catch (err) {
      setError(errorMessage(err));
      return null;
    } finally {
      setBusy(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    const made = await run(() => createCluster(form), `${form.name} created`);
    if (made) {
      setForm({ name: "", kind: form.kind });
      if (made.id) setSelectedId(made.id);
    }
  };

  const handleRename = () => {
    const name = window.prompt("New name for this cluster:", selected.name);
    if (name && name.trim() && name.trim() !== selected.name) {
      run(() => updateCluster(selected.id, { name: name.trim() }), "Renamed");
    }
  };

  const handleDelete = async () => {
    if (window.confirm(`Delete "${selected.name}"? The people in it stay in the register.`)) {
      if (await run(() => deleteCluster(selected.id), "Cluster deleted")) setSelectedId(null);
    }
  };

  return (
    <div>
      <PageHeader title="Clusters" description="Groups by location (prayer cells) and for fundraising. A member can belong to several." />
      <div className="mb-4"><FormError>{error}</FormError></div>

      <div className="grid gap-6 md:grid-cols-3">
        <section className="space-y-4 md:col-span-1">
          <Card as="form" onSubmit={handleCreate} className="space-y-3">
            <h2 className="text-lg font-semibold">New cluster</h2>
            <Input aria-label="Cluster name" placeholder="e.g. Kitisuru Cell or Building Fund" value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            <Select aria-label="Kind" value={form.kind} onChange={(e) => setForm({ ...form, kind: e.target.value })}
              options={newKinds.map((value) => ({ value, label: kindLabels[value] }))} />
            <Button type="submit" icon={Plus} loading={busy}>Create</Button>
          </Card>

          <Card padded={false}>
            {clusters.length === 0 ? (
              <p className="p-5 text-sm text-muted">No clusters yet.</p>
            ) : (
              <ul className="divide-y divide-line/70">
                {clusters.map((c) => (
                  <li key={c.id}>
                    <button
                      type="button" aria-current={c.id === selectedId}
                      onClick={() => { setSelectedId(c.id); setSearch(""); }}
                      className={`w-full px-5 py-3.5 text-left transition first:rounded-t-card last:rounded-b-card ${c.id === selectedId ? "bg-forest-50" : "hover:bg-paper"}`}
                    >
                      <span className={`block ${c.id === selectedId ? "font-semibold text-forest-900" : "font-medium"}`}>{c.name}</span>
                      <span className="block text-xs text-muted">{kindLabels[c.kind]} · {c.member_count} members</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </section>

        <Card className="md:col-span-2">
          {!selected ? (
            <EmptyState icon={UsersRound} title="No cluster chosen">Create or choose a cluster to manage its members.</EmptyState>
          ) : (
            <>
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-semibold">{selected.name}</h2>
                  <Badge tone="green">{kindLabels[selected.kind]}</Badge>
                </div>
                <div className="flex gap-2">
                  <Button variant="secondary" size="sm" icon={Pencil} onClick={handleRename} disabled={busy}>Rename</Button>
                  <Button variant="danger" size="sm" icon={Trash2} onClick={handleDelete} disabled={busy}>Delete</Button>
                </div>
              </div>

              <h3 className="mb-2 text-sm font-medium">Add people</h3>
              <SearchInput value={search} onChange={setSearch} placeholder="Type a name, email or phone" />
              {candidates.length > 0 && (
                <ul className="mt-2 divide-y divide-line/70 rounded-xl border border-line px-3">
                  {candidates.map((m) => (
                    <PersonRow key={m.id} person={m} action={
                      <Button size="sm" variant="secondary" icon={UserPlus} disabled={busy}
                        aria-label={`Add ${fullName(m)}`}
                        onClick={() => run(() => changeClusterMembers(selected.id, { add: [m.id] }), `${fullName(m)} added`)}>Add</Button>
                    } />
                  ))}
                </ul>
              )}
              {search.trim() && candidates.length === 0 && <p className="mt-2 text-sm text-muted">No one else matches.</p>}

              <h3 className="mt-6 mb-1 font-display text-lg font-semibold">In this cluster ({inCluster.length})</h3>
              {inCluster.length === 0 ? (
                <p className="text-sm text-muted">No one yet. Search above to add people.</p>
              ) : (
                <ul className="divide-y divide-line/70">
                  {inCluster.map((m) => (
                    <PersonRow key={m.id} person={m} action={
                      <Button size="sm" variant="ghost" icon={UserMinus} disabled={busy}
                        aria-label={`Remove ${fullName(m)}`}
                        onClick={() => run(() => changeClusterMembers(selected.id, { remove: [m.id] }), `${fullName(m)} removed`)}>Remove</Button>
                    } />
                  ))}
                </ul>
              )}
            </>
          )}
        </Card>
      </div>
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

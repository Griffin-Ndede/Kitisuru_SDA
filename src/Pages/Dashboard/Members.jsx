import React, { useMemo, useState, useId, useEffect, useRef } from "react";
import { useLoaderData, useRevalidator, useRouteLoaderData, Link } from "react-router";
import { exportMembers } from "../../Api";
import { errorMessage } from "../../Api/client";
import { Download, Pencil, Plus, Upload, Users, LoaderCircle, Inbox, Search, CircleAlert, X } from "lucide-react";
import ImportDialog from "./ImportDialog";
import MemberDialog from "./MemberDialog";
import { fullName, genderLabels, matchesSearch, statusLabels, statusOf } from "./memberHelpers";

// Admin only: the member register.
export default function Members() {
  const { members, clusters, ministries } = useLoaderData();
  const { user: me } = useRouteLoaderData("dashboard");
  const revalidator = useRevalidator();
  const [search, setSearch] = useState("");
  const [cluster, setCluster] = useState("");
  const [ministry, setMinistry] = useState("");
  const [gender, setGender] = useState("");
  const [status, setStatus] = useState("");
  const [dialog, setDialog] = useState(null); // "add", "import", or a member's id
  const [error, setError] = useState("");

  const clusterNames = useMemo(() => Object.fromEntries(clusters.map((c) => [c.id, c.name])), [clusters]);
  const ministryNames = useMemo(() => Object.fromEntries(ministries.map((m) => [m.id, m.title])), [ministries]);
  const shown = useMemo(
    () =>
      members.filter(
        (m) =>
          matchesSearch(m, search) &&
          (!cluster || m.clusters.includes(Number(cluster))) &&
          (!ministry || m.ministries.includes(Number(ministry))) &&
          (!gender || m.gender === gender) &&
          (!status || statusOf(m) === status)
      ),
    [members, search, cluster, ministry, gender, status]
  );
  const editing = typeof dialog === "number" ? members.find((m) => m.id === dialog) : null;
  const refresh = () => revalidator.revalidate();

  const handleExport = async () => {
    setError("");
    try {
      await exportMembers();
    } catch (err) {
      setError(errorMessage(err));
    }
  };

  const statusTone = { active: "green", waiting: "gold", record: "grey", off: "clay" };

  const columns = [
    {
      key: "name", header: "Name",
      render: (m) => (
        <div className="flex items-center gap-3">
          <Avatar name={fullName(m)} size="sm" />
          <div className="min-w-0">
            <p className="truncate font-medium">{fullName(m)}</p>
            <p className="truncate text-xs text-muted">{m.email || "no email"}</p>
          </div>
        </div>
      ),
    },
    { key: "phone", header: "Phone", hideOnMobile: true },
    { key: "gender", header: "Gender", hideOnMobile: true, render: (m) => genderLabels[m.gender] },
    { key: "clusters", header: "Clusters", hideOnMobile: true, render: (m) => m.clusters.map((id) => clusterNames[id]).join(", ") || "—" },
    { key: "ministries", header: "Ministries", hideOnMobile: true, render: (m) => m.ministries.map((id) => ministryNames[id]).join(", ") || "—" },
    { key: "status", header: "Status", render: (m) => <Badge tone={statusTone[statusOf(m)]}>{statusLabels[statusOf(m)]}</Badge> },
    {
      key: "edit", header: <span className="sr-only">Edit</span>, className: "text-right",
      render: (m) => (
        <Button variant="ghost" size="sm" icon={Pencil} onClick={() => setDialog(m.id)} aria-label={`Edit ${fullName(m)}`}>Edit</Button>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Members"
        description="The church register. Only admins can see this page."
        actions={
          <>
            <Button icon={Plus} onClick={() => setDialog("add")}>Add member</Button>
            <Button variant="secondary" icon={Upload} onClick={() => setDialog("import")}>Import</Button>
            <Button variant="secondary" icon={Download} onClick={handleExport}>Export CSV</Button>
          </>
        }
      />
      <div className="mb-4"><FormError>{error}</FormError></div>

      <div className="mb-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <SearchInput value={search} onChange={setSearch} placeholder="Search name, email, phone" />
        <Select aria-label="Filter by cluster" value={cluster} onChange={(e) => setCluster(e.target.value)}
          placeholder="All clusters" options={clusters.map((c) => ({ value: c.id, label: c.name }))} />
        <Select aria-label="Filter by ministry" value={ministry} onChange={(e) => setMinistry(e.target.value)}
          placeholder="All ministries" options={ministries.map((m) => ({ value: m.id, label: m.title }))} />
        <Select aria-label="Filter by gender" value={gender} onChange={(e) => setGender(e.target.value)}
          placeholder="All genders" options={[{ value: "male", label: "Male" }, { value: "female", label: "Female" }]} />
        <Select aria-label="Filter by status" value={status} onChange={(e) => setStatus(e.target.value)}
          placeholder="Any status" options={Object.entries(statusLabels).map(([value, label]) => ({ value, label }))} />
      </div>
      <p className="mb-3 text-sm text-muted" aria-live="polite">Showing {shown.length} of {members.length}</p>

      <DataTable
        columns={columns}
        rows={shown}
        empty={<EmptyState icon={Users} title="No one matches">Try clearing a filter or the search.</EmptyState>}
      />

      {dialog === "add" && (
        <Modal title="Add a member" onClose={() => setDialog(null)}>
          <MemberDialog member={null} clusters={clusters} ministries={ministries} me={me} onSaved={refresh} onClose={() => setDialog(null)} />
        </Modal>
      )}
      {dialog === "import" && (
        <Modal title="Import members" onClose={() => setDialog(null)}>
          <ImportDialog onDone={refresh} onClose={() => setDialog(null)} />
        </Modal>
      )}
      {editing && (
        <Modal title={fullName(editing)} onClose={() => setDialog(null)}>
          <MemberDialog key={editing.id} member={editing} clusters={clusters} ministries={ministries} me={me} onSaved={refresh} onClose={() => setDialog(null)} />
        </Modal>
      )}
    </div>
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

function Card({ as: Tag = "div", padded = true, className = "", children, ...props }) {
  return (
    <Tag className={`rounded-card border border-line bg-white shadow-card ${padded ? "p-5 sm:p-6" : ""} ${className}`} {...props}>
      {children}
    </Tag>
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

// A table inside a card, with an empty state.
// columns: [{ key, header, render?(row), className?, hideOnMobile? }]
function DataTable({ columns, rows, empty, onRowClick, rowKey = "id" }) {
  if (!rows.length) return <Card padded={false}>{empty || <EmptyState title="Nothing here yet" />}</Card>;
  return (
    <Card padded={false}>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-line text-xs uppercase tracking-wider text-muted">
              {columns.map((col) => (
                <th key={col.key} scope="col" className={`px-5 py-3 font-semibold ${col.hideOnMobile ? "hidden md:table-cell" : ""} ${col.className || ""}`}>{col.header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row[rowKey]}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                className={`border-b border-line/70 last:border-0 ${onRowClick ? "cursor-pointer hover:bg-paper" : ""}`}
              >
                {columns.map((col) => (
                  <td key={col.key} className={`px-5 py-3.5 align-middle ${col.hideOnMobile ? "hidden md:table-cell" : ""} ${col.className || ""}`}>
                    {col.render ? col.render(row) : row[col.key] || "—"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
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

// A banner for an error next to a form.
function FormError({ children }) {
  if (!children) return null;
  return (
    <p role="alert" className="flex items-start gap-2 rounded-xl bg-clay-100 px-3.5 py-2.5 text-sm text-clay-700">
      <CircleAlert className="mt-0.5 size-4 shrink-0" />{children}
    </p>
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

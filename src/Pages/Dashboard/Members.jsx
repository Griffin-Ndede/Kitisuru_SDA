import React, { useMemo, useState, useEffect } from "react";
import { useLoaderData, useRevalidator } from "react-router";
import { exportMembers } from "../../Api";
import { useUser } from "../../Context/UserContext";
import { errorMessage } from "../../Api/client";
import { Download, Pencil, Plus, Upload, Users, Search, CircleAlert, X } from "lucide-react";
import ImportDialog from "./ImportDialog";
import MemberDialog from "./MemberDialog";
import { fullName, genderLabels, matchesSearch, statusLabels, statusOf } from "./memberHelpers";

// Admin only: the member register.
export default function Members() {
  const { members, clusters, ministries } = useLoaderData();
  const { user: me } = useUser();
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
          (!status || statusOf(m) === status),
      ),
    [members, search, cluster, ministry, gender, status],
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

  const statusTone = {
    active: "bg-forest-100 text-forest-800",
    waiting: "bg-marigold-100 text-marigold-600",
    record: "bg-paper-deep text-muted",
    off: "bg-clay-100 text-clay-700",
  };

  // A box over the page closes on Escape and stops the page behind it from scrolling
  useEffect(() => {
    if (dialog === null) return undefined;
    const onKey = (event) => event.key === "Escape" && setDialog(null);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [dialog]);

  return (
    <div>
      <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold sm:text-4xl">Members</h1>
          <p className="mt-1.5 max-w-2xl text-muted">The church register. Only admins can see this page.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {
            <>
              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 rounded-full font-semibold transition active:translate-y-px disabled:opacity-60 bg-forest-900 text-paper hover:bg-forest-800 shadow-card px-4 py-2.5 text-sm"
                onClick={() => setDialog("add")}
              >
                <Plus className="size-4" />
                Add member
              </button>
              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 rounded-full font-semibold transition active:translate-y-px disabled:opacity-60 border border-line bg-white text-ink hover:border-forest-600 hover:text-forest-800 px-4 py-2.5 text-sm"
                onClick={() => setDialog("import")}
              >
                <Upload className="size-4" />
                Import
              </button>
              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 rounded-full font-semibold transition active:translate-y-px disabled:opacity-60 border border-line bg-white text-ink hover:border-forest-600 hover:text-forest-800 px-4 py-2.5 text-sm"
                onClick={handleExport}
              >
                <Download className="size-4" />
                Export CSV
              </button>
            </>
          }
        </div>
      </header>
      <div className="mb-4">
        {error && (
          <p role="alert" className="flex items-start gap-2 rounded-3xl bg-clay-100 px-3.5 py-2.5 text-sm text-clay-700">
            <CircleAlert className="mt-0.5 size-4 shrink-0" />
            {error}
          </p>
        )}
      </div>

      <div className="mb-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted" />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={"Search name, email, phone"}
            aria-label={"Search name, email, phone"}
            className="input pl-10"
          />
        </div>
        <div>
          <select
            className="input"
            aria-label="Filter by cluster"
            value={cluster}
            onChange={(e) => setCluster(e.target.value)}
          >
            <option value="">All clusters</option>
            {clusters.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <select
            className="input"
            aria-label="Filter by ministry"
            value={ministry}
            onChange={(e) => setMinistry(e.target.value)}
          >
            <option value="">All ministries</option>
            {ministries.map((m) => (
              <option key={m.id} value={m.id}>
                {m.title}
              </option>
            ))}
          </select>
        </div>
        <div>
          <select
            className="input"
            aria-label="Filter by gender"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          >
            <option value="">All genders</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
        <div>
          <select
            className="input"
            aria-label="Filter by status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">Any status</option>
            {Object.entries(statusLabels)
              .map(([value, label]) => ({ value, label }))
              .map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
          </select>
        </div>
      </div>
      <p className="mb-3 text-sm text-muted" aria-live="polite">
        Showing {shown.length} of {members.length}
      </p>

      <div className="rounded-3xl border border-line bg-white shadow-card overflow-hidden">
        {shown.length === 0 ? (
          <div className="flex flex-col items-center px-6 py-12 text-center">
            <span className="arch grid h-16 w-14 place-items-center bg-forest-50 text-forest-600">
              <Users className="size-6" />
            </span>
            <h3 className="mt-4 text-lg font-semibold">No one matches</h3>
            <p className="mt-1 max-w-sm text-sm text-muted">Try clearing a filter or the search.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-line text-xs uppercase tracking-wider text-muted">
                  <th scope="col" className="px-5 py-3 font-semibold">
                    Name
                  </th>
                  <th scope="col" className="hidden px-5 py-3 font-semibold md:table-cell">
                    Phone
                  </th>
                  <th scope="col" className="hidden px-5 py-3 font-semibold md:table-cell">
                    Gender
                  </th>
                  <th scope="col" className="hidden px-5 py-3 font-semibold md:table-cell">
                    Clusters
                  </th>
                  <th scope="col" className="hidden px-5 py-3 font-semibold md:table-cell">
                    Ministries
                  </th>
                  <th scope="col" className="px-5 py-3 font-semibold">
                    Status
                  </th>
                  <th scope="col" className="px-5 py-3 text-right font-semibold">
                    <span className="sr-only">Edit</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {shown.map((m) => (
                  <tr key={m.id} className="border-b border-line/70 last:border-0">
                    <td className="px-5 py-3.5 align-middle">
                      <div className="flex items-center gap-3">
                        <span
                          className="grid size-8 shrink-0 place-items-center rounded-full bg-forest-100 text-xs font-semibold text-forest-800"
                          aria-hidden="true"
                        >
                          {(fullName(m) || "")
                            .trim()
                            .split(/\s+/)
                            .slice(0, 2)
                            .map((part) => part[0]?.toUpperCase())
                            .join("") || "?"}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate font-medium">{fullName(m)}</p>
                          {m.positions?.length > 0 && (
                            <p className="truncate text-xs font-semibold text-marigold-600">{m.positions.join(", ")}</p>
                          )}
                          <p className="truncate text-xs text-muted">{m.email || "no email"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="hidden px-5 py-3.5 align-middle md:table-cell">{m.phone || "—"}</td>
                    <td className="hidden px-5 py-3.5 align-middle md:table-cell">{genderLabels[m.gender] || "—"}</td>
                    <td className="hidden px-5 py-3.5 align-middle md:table-cell">
                      {m.clusters.map((id) => clusterNames[id]).join(", ") || "—"}
                    </td>
                    <td className="hidden px-5 py-3.5 align-middle md:table-cell">
                      {m.ministries.map((id) => ministryNames[id]).join(", ") || "—"}
                    </td>
                    <td className="px-5 py-3.5 align-middle">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusTone[statusOf(m)]}`}
                      >
                        {statusLabels[statusOf(m)]}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right align-middle">
                      <button
                        type="button"
                        onClick={() => setDialog(m.id)}
                        aria-label={`Edit ${fullName(m)}`}
                        className="inline-flex items-center justify-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold text-forest-800 transition hover:bg-forest-50 active:translate-y-px"
                      >
                        <Pencil className="size-4" />
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {dialog === "add" && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6">
          <div
            className="absolute inset-0 bg-forest-950/50 backdrop-blur-[2px]"
            onClick={() => setDialog(null)}
            aria-hidden="true"
          />
          <div
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-label={"Add a member"}
            className="rise relative flex max-h-[92vh] w-full flex-col rounded-t-3xl bg-white shadow-lift outline-none sm:rounded-3xl sm:max-w-xl"
          >
            <header className="flex items-start justify-between gap-4 border-b border-line px-5 py-4 sm:px-6">
              <div>
                <h2 className="text-xl font-semibold">Add a member</h2>
              </div>
              <button
                type="button"
                onClick={() => setDialog(null)}
                aria-label="Close"
                className="rounded-full p-1.5 text-muted hover:bg-paper-deep hover:text-ink"
              >
                <X className="size-5" />
              </button>
            </header>
            <div className="overflow-y-auto px-5 py-5 sm:px-6">
              <MemberDialog
                member={null}
                clusters={clusters}
                ministries={ministries}
                me={me}
                onSaved={refresh}
                onClose={() => setDialog(null)}
              />
            </div>
          </div>
        </div>
      )}
      {dialog === "import" && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6">
          <div
            className="absolute inset-0 bg-forest-950/50 backdrop-blur-[2px]"
            onClick={() => setDialog(null)}
            aria-hidden="true"
          />
          <div
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-label={"Import members"}
            className="rise relative flex max-h-[92vh] w-full flex-col rounded-t-3xl bg-white shadow-lift outline-none sm:rounded-3xl sm:max-w-xl"
          >
            <header className="flex items-start justify-between gap-4 border-b border-line px-5 py-4 sm:px-6">
              <div>
                <h2 className="text-xl font-semibold">Import members</h2>
              </div>
              <button
                type="button"
                onClick={() => setDialog(null)}
                aria-label="Close"
                className="rounded-full p-1.5 text-muted hover:bg-paper-deep hover:text-ink"
              >
                <X className="size-5" />
              </button>
            </header>
            <div className="overflow-y-auto px-5 py-5 sm:px-6">
              <ImportDialog onDone={refresh} onClose={() => setDialog(null)} />
            </div>
          </div>
        </div>
      )}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6">
          <div
            className="absolute inset-0 bg-forest-950/50 backdrop-blur-[2px]"
            onClick={() => setDialog(null)}
            aria-hidden="true"
          />
          <div
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-label={fullName(editing)}
            className="rise relative flex max-h-[92vh] w-full flex-col rounded-t-3xl bg-white shadow-lift outline-none sm:rounded-3xl sm:max-w-xl"
          >
            <header className="flex items-start justify-between gap-4 border-b border-line px-5 py-4 sm:px-6">
              <div>
                <h2 className="text-xl font-semibold">{fullName(editing)}</h2>
              </div>
              <button
                type="button"
                onClick={() => setDialog(null)}
                aria-label="Close"
                className="rounded-full p-1.5 text-muted hover:bg-paper-deep hover:text-ink"
              >
                <X className="size-5" />
              </button>
            </header>
            <div className="overflow-y-auto px-5 py-5 sm:px-6">
              <MemberDialog
                key={editing.id}
                member={editing}
                clusters={clusters}
                ministries={ministries}
                me={me}
                onSaved={refresh}
                onClose={() => setDialog(null)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

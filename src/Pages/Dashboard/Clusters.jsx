import React, { useMemo, useState } from "react";
import { useLoaderData, useRevalidator } from "react-router";
import { Pencil, Plus, Trash2, UserMinus, UserPlus, UsersRound, LoaderCircle, Search, CircleAlert } from "lucide-react";
import { changeClusterMembers, createCluster, deleteCluster, updateCluster } from "../../Api";
import Swal from "sweetalert2";
import { errorMessage } from "../../Api/client";
import { useToast } from "../../Context/ToastContext";
import { fullName, kindLabels, matchesSearch, newKinds } from "./memberHelpers";

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
  const inCluster = useMemo(
    () => members.filter((m) => selected && m.clusters.includes(selected.id)),
    [members, selected],
  );
  const candidates = useMemo(
    () =>
      selected && search.trim()
        ? members.filter((m) => !m.clusters.includes(selected.id) && matchesSearch(m, search)).slice(0, 8)
        : [],
    [members, selected, search],
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

  const handleRename = async () => {
    const { isConfirmed, value } = await Swal.fire({
      title: "Rename this cluster",
      input: "text",
      inputValue: selected.name,
      inputAttributes: { "aria-label": "New name for this cluster" },
      inputValidator: (text) => (!text.trim() ? "Please type a name." : undefined),
      showCancelButton: true,
      confirmButtonText: "Save",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#2e8eb4", // the website's blue
      cancelButtonColor: "#6b7280",
      reverseButtons: true,
    });
    if (isConfirmed && value.trim() !== selected.name) {
      run(() => updateCluster(selected.id, { name: value.trim() }), "Renamed");
    }
  };

  const handleDelete = async () => {
    const { isConfirmed } = await Swal.fire({
      title: `Delete "${selected.name}"?`,
      text: "The people in it stay in the register.",
      icon: "warning",
      iconColor: "#ffc700", // the website's yellow
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
      cancelButtonText: "Keep it",
      confirmButtonColor: "#b04a2a", // red: this removes something
      cancelButtonColor: "#6b7280", // grey
      reverseButtons: true,
      focusCancel: true,
    });
    if (isConfirmed && (await run(() => deleteCluster(selected.id), "Cluster deleted"))) setSelectedId(null);
  };

  return (
    <div>
      <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold sm:text-4xl">Clusters</h1>
          <p className="mt-1.5 max-w-2xl text-muted">
            Groups by location (prayer cells) and for fundraising. A member can belong to several.
          </p>
        </div>
      </header>
      <div className="mb-4">
        {error && (
          <p role="alert" className="flex items-start gap-2 rounded-xl bg-clay-100 px-3.5 py-2.5 text-sm text-clay-700">
            <CircleAlert className="mt-0.5 size-4 shrink-0" />
            {error}
          </p>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <section className="space-y-4 md:col-span-1">
          <form
            className="rounded-card border border-line bg-white shadow-card p-5 sm:p-6 space-y-3"
            onSubmit={handleCreate}
          >
            <h2 className="text-lg font-semibold">New cluster</h2>
            <div>
              <input
                className="input"
                required
                aria-label="Cluster name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div>
              <select
                className="input"
                aria-label="Kind"
                value={form.kind}
                onChange={(e) => setForm({ ...form, kind: e.target.value })}
              >
                {newKinds
                  .map((value) => ({ value, label: kindLabels[value] }))
                  .map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
              </select>
            </div>
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-full font-semibold transition active:translate-y-px disabled:opacity-60 bg-forest-900 text-paper hover:bg-forest-800 shadow-card px-4 py-2.5 text-sm"
              disabled={busy}
            >
              {busy ? <LoaderCircle className="size-4 animate-spin" /> : <Plus className="size-4" />}
              Create
            </button>
          </form>

          <div className="rounded-card border border-line bg-white shadow-card">
            {clusters.length === 0 ? (
              <p className="p-5 text-sm text-muted">No clusters yet.</p>
            ) : (
              <ul className="divide-y divide-line/70">
                {clusters.map((c) => (
                  <li key={c.id}>
                    <button
                      type="button"
                      aria-current={c.id === selectedId}
                      onClick={() => {
                        setSelectedId(c.id);
                        setSearch("");
                      }}
                      className={`w-full px-5 py-3.5 text-left transition first:rounded-t-card last:rounded-b-card ${c.id === selectedId ? "bg-forest-50" : "hover:bg-paper"}`}
                    >
                      <span
                        className={`block ${c.id === selectedId ? "font-semibold text-forest-900" : "font-medium"}`}
                      >
                        {c.name}
                      </span>
                      <span className="block text-xs text-muted">
                        {kindLabels[c.kind]} · {c.member_count} members
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        <div className="rounded-card border border-line bg-white shadow-card p-5 sm:p-6 md:col-span-2">
          {!selected ? (
            <div className="flex flex-col items-center px-6 py-12 text-center">
              <span className="arch grid h-16 w-14 place-items-center bg-forest-50 text-forest-600">
                <UsersRound className="size-6" />
              </span>
              <h3 className="mt-4 text-lg font-semibold">No cluster chosen</h3>
              <p className="mt-1 max-w-sm text-sm text-muted">Create or choose a cluster to manage its members.</p>
            </div>
          ) : (
            <>
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-semibold">{selected.name}</h2>
                  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-forest-100 text-forest-800">
                    {kindLabels[selected.kind]}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="inline-flex items-center justify-center gap-2 rounded-full font-semibold transition active:translate-y-px disabled:opacity-60 border border-line bg-white text-ink hover:border-forest-600 hover:text-forest-800 px-3 py-1.5 text-sm"
                    disabled={busy}
                    onClick={handleRename}
                  >
                    <Pencil className="size-4" />
                    Rename
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center justify-center gap-2 rounded-full font-semibold transition active:translate-y-px disabled:opacity-60 bg-clay-600 text-white hover:bg-clay-700 px-3 py-1.5 text-sm"
                    disabled={busy}
                    onClick={handleDelete}
                  >
                    <Trash2 className="size-4" />
                    Delete
                  </button>
                </div>
              </div>

              <h3 className="mb-2 text-sm font-medium">Add people</h3>
              <div className="relative">
                <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted" />
                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder={"Type a name, email or phone"}
                  aria-label={"Type a name, email or phone"}
                  className="input pl-10"
                />
              </div>
              {candidates.length > 0 && (
                <ul className="mt-2 divide-y divide-line/70 rounded-xl border border-line px-3">
                  {candidates.map((m) => (
                    <li key={m.id} className="flex items-center justify-between gap-3 py-2.5">
                      <span className="flex min-w-0 items-center gap-3">
                        <span
                          className="size-8 text-xs grid shrink-0 place-items-center rounded-full bg-forest-100 font-semibold text-forest-800"
                          aria-hidden="true"
                        >
                          {(fullName(m) || "")
                            .trim()
                            .split(/\s+/)
                            .slice(0, 2)
                            .map((part) => part[0]?.toUpperCase())
                            .join("") || "?"}
                        </span>
                        <span className="min-w-0">
                          <span className="block truncate text-sm font-medium">{fullName(m)}</span>
                          <span className="block truncate text-xs text-muted">{m.phone || m.email}</span>
                        </span>
                      </span>
                      <button
                        type="button"
                        className="inline-flex items-center justify-center gap-2 rounded-full font-semibold transition active:translate-y-px disabled:opacity-60 border border-line bg-white text-ink hover:border-forest-600 hover:text-forest-800 px-3 py-1.5 text-sm"
                        disabled={busy}
                        aria-label={`Add ${fullName(m)}`}
                        onClick={() =>
                          run(() => changeClusterMembers(selected.id, { add: [m.id] }), `${fullName(m)} added`)
                        }
                      >
                        <UserPlus className="size-4" />
                        Add
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              {search.trim() && candidates.length === 0 && (
                <p className="mt-2 text-sm text-muted">No one else matches.</p>
              )}

              <h3 className="mt-6 mb-1 font-display text-lg font-semibold">In this cluster ({inCluster.length})</h3>
              {inCluster.length === 0 ? (
                <p className="text-sm text-muted">No one yet. Search above to add people.</p>
              ) : (
                <ul className="divide-y divide-line/70">
                  {inCluster.map((m) => (
                    <li key={m.id} className="flex items-center justify-between gap-3 py-2.5">
                      <span className="flex min-w-0 items-center gap-3">
                        <span
                          className="size-8 text-xs grid shrink-0 place-items-center rounded-full bg-forest-100 font-semibold text-forest-800"
                          aria-hidden="true"
                        >
                          {(fullName(m) || "")
                            .trim()
                            .split(/\s+/)
                            .slice(0, 2)
                            .map((part) => part[0]?.toUpperCase())
                            .join("") || "?"}
                        </span>
                        <span className="min-w-0">
                          <span className="block truncate text-sm font-medium">{fullName(m)}</span>
                          <span className="block truncate text-xs text-muted">{m.phone || m.email}</span>
                        </span>
                      </span>
                      <button
                        type="button"
                        className="inline-flex items-center justify-center gap-2 rounded-full font-semibold transition active:translate-y-px disabled:opacity-60 text-forest-800 hover:bg-forest-50 px-3 py-1.5 text-sm"
                        disabled={busy}
                        aria-label={`Remove ${fullName(m)}`}
                        onClick={() =>
                          run(() => changeClusterMembers(selected.id, { remove: [m.id] }), `${fullName(m)} removed`)
                        }
                      >
                        <UserMinus className="size-4" />
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

import React, { useMemo, useState } from "react";
import { useLoaderData, useRevalidator } from "react-router";
import { changeClusterMembers, createCluster, deleteCluster, updateCluster } from "../../Api";
import { errorMessage } from "../../Api/client";
import { inputClass } from "../../Components/AuthCard";
import { fullName, kindLabels, matchesSearch } from "./memberHelpers";

// Admin only: prayer cells and departments, and who belongs to each.
export default function Clusters() {
  const { members, clusters } = useLoaderData();
  const revalidator = useRevalidator();
  const [selectedId, setSelectedId] = useState(clusters[0]?.id ?? null);
  const [form, setForm] = useState({ name: "", kind: "prayer_cell" });
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
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
    setMessage("");
    setBusy(true);
    try {
      const result = await action();
      setMessage(success);
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
    const made = await run(() => createCluster(form), `${form.name} created.`);
    if (made) {
      setForm({ name: "", kind: form.kind });
      if (made.id) setSelectedId(made.id);
    }
  };

  const handleRename = () => {
    const name = window.prompt("New name for this cluster:", selected.name);
    if (name && name.trim() && name.trim() !== selected.name) {
      run(() => updateCluster(selected.id, { name: name.trim() }), "Renamed.");
    }
  };

  const handleDelete = async () => {
    if (window.confirm(`Delete "${selected.name}"? The people in it stay in the register.`)) {
      if (await run(() => deleteCluster(selected.id), "Cluster deleted.")) setSelectedId(null);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-extrabold text-custom-blue mb-2">Clusters</h1>
      <p className="text-gray-600 mb-6">Prayer cells and departments. A member can belong to several.</p>
      {(message || error) && (
        <p role={error ? "alert" : "status"} className={`mb-4 text-sm ${error ? "text-red-600" : "text-green-700"}`}>{error || message}</p>
      )}

      <div className="grid gap-6 md:grid-cols-3">
        <section className="md:col-span-1 space-y-4">
          <form onSubmit={handleCreate} className="rounded-2xl bg-white border border-gray-200 p-4 space-y-3">
            <h2 className="font-bold">New cluster</h2>
            <input className={inputClass} placeholder="Name, e.g. Youth or Kitisuru Cell" aria-label="Cluster name" value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            <select className={inputClass} aria-label="Kind" value={form.kind} onChange={(e) => setForm({ ...form, kind: e.target.value })}>
              {Object.entries(kindLabels).map(([value, text]) => <option key={value} value={value}>{text}</option>)}
            </select>
            <button type="submit" disabled={busy} className="px-5 py-2 rounded-full bg-custom-blue text-white cursor-pointer disabled:opacity-60">Create</button>
          </form>

          <ul className="rounded-2xl bg-white border border-gray-200 divide-y divide-gray-100">
            {clusters.length === 0 && <li className="p-4 text-gray-500 text-sm">No clusters yet.</li>}
            {clusters.map((c) => (
              <li key={c.id}>
                <button onClick={() => { setSelectedId(c.id); setSearch(""); }}
                  className={`w-full text-left px-4 py-3 cursor-pointer ${c.id === selectedId ? "bg-blue-50 font-semibold" : ""}`}>
                  {c.name}
                  <span className="block text-xs text-gray-500 font-normal">{kindLabels[c.kind]} · {c.member_count} members</span>
                </button>
              </li>
            ))}
          </ul>
        </section>

        <section className="md:col-span-2 rounded-2xl bg-white border border-gray-200 p-6">
          {!selected ? (
            <p className="text-gray-500">Create or choose a cluster to manage its members.</p>
          ) : (
            <>
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <h2 className="text-xl font-bold">{selected.name} <span className="text-sm font-normal text-gray-500">{kindLabels[selected.kind]}</span></h2>
                <span className="space-x-4 text-sm">
                  <button onClick={handleRename} disabled={busy} className="text-custom-blue underline cursor-pointer">Rename</button>
                  <button onClick={handleDelete} disabled={busy} className="text-red-600 underline cursor-pointer">Delete</button>
                </span>
              </div>

              <label htmlFor="add_member" className="block text-sm font-medium text-gray-700 mb-1">Add people</label>
              <input id="add_member" className={inputClass} type="search" placeholder="Type a name, email or phone" value={search} onChange={(e) => setSearch(e.target.value)} />
              {candidates.length > 0 && (
                <ul className="mt-2 border border-gray-200 rounded-lg divide-y divide-gray-100">
                  {candidates.map((m) => (
                    <li key={m.id} className="flex items-center justify-between px-3 py-2">
                      <span>{fullName(m)} <span className="text-gray-500 text-sm">{m.phone || m.email}</span></span>
                      <button disabled={busy} onClick={() => run(() => changeClusterMembers(selected.id, { add: [m.id] }), `${fullName(m)} added.`)}
                        className="text-custom-blue underline cursor-pointer">Add</button>
                    </li>
                  ))}
                </ul>
              )}
              {search.trim() && candidates.length === 0 && <p className="text-sm text-gray-500 mt-2">No one else matches.</p>}

              <h3 className="font-semibold mt-6 mb-2">In this cluster ({inCluster.length})</h3>
              {inCluster.length === 0 ? (
                <p className="text-sm text-gray-500">No one yet. Search above to add people.</p>
              ) : (
                <ul className="divide-y divide-gray-100">
                  {inCluster.map((m) => (
                    <li key={m.id} className="flex items-center justify-between py-2">
                      <span>{fullName(m)} <span className="text-gray-500 text-sm">{m.phone || m.email}</span></span>
                      <button disabled={busy} onClick={() => run(() => changeClusterMembers(selected.id, { remove: [m.id] }), `${fullName(m)} removed.`)}
                        className="text-red-600 underline cursor-pointer text-sm" aria-label={`Remove ${fullName(m)}`}>Remove</button>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
}

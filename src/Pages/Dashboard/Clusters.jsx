import React, { useMemo, useState } from "react";
import { useLoaderData, useRevalidator } from "react-router";
import { Pencil, Plus, Trash2, UserMinus, UserPlus, UsersRound } from "lucide-react";
import { changeClusterMembers, createCluster, deleteCluster, updateCluster } from "../../Api";
import { errorMessage } from "../../Api/client";
import Card from "../../Components/ui/Card";
import Button from "../../Components/ui/Button";
import Badge from "../../Components/ui/Badge";
import Avatar from "../../Components/ui/Avatar";
import PageHeader from "../../Components/ui/PageHeader";
import { Input, Select, SearchInput } from "../../Components/ui/Fields";
import { EmptyState, FormError } from "../../Components/ui/States";
import { useToast } from "../../Context/ToastContext";
import { fullName, kindLabels, matchesSearch } from "./memberHelpers";

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

// Admin only: prayer cells and departments, and who belongs to each.
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
      <PageHeader title="Clusters" description="Prayer cells and departments. A member can belong to several." />
      <div className="mb-4"><FormError>{error}</FormError></div>

      <div className="grid gap-6 md:grid-cols-3">
        <section className="space-y-4 md:col-span-1">
          <Card as="form" onSubmit={handleCreate} className="space-y-3">
            <h2 className="text-lg font-semibold">New cluster</h2>
            <Input aria-label="Cluster name" placeholder="e.g. Youth or Kitisuru Cell" value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            <Select aria-label="Kind" value={form.kind} onChange={(e) => setForm({ ...form, kind: e.target.value })}
              options={Object.entries(kindLabels).map(([value, label]) => ({ value, label }))} />
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

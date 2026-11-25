import React, { useMemo, useState } from "react";
import { Link, useLoaderData, useNavigate, useRevalidator } from "react-router";
import {
  ArrowLeft,
  CalendarClock,
  CircleAlert,
  LoaderCircle,
  MapPin,
  Pencil,
  Phone,
  Search,
  Trash2,
  User,
  UserMinus,
  UserPlus,
  UsersRound,
} from "lucide-react";
import Swal from "sweetalert2";
import { changeClusterMembers, deleteCluster, updateCluster } from "../../Api";
import { errorMessage } from "../../Api/client";
import { useToast } from "../../Context/ToastContext";
import { fullName, kindLabels, matchesSearch } from "./memberHelpers";

// One cluster: its information (what it is, when and where it meets, who to
// contact) and the people in it. Admin only.
export default function ClusterDetail() {
  const { cluster, members } = useLoaderData();
  const navigate = useNavigate();
  const revalidator = useRevalidator();
  const toast = useToast();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(null);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const inCluster = useMemo(() => members.filter((m) => m.clusters.includes(cluster.id)), [members, cluster]);
  const candidates = useMemo(
    () =>
      search.trim()
        ? members.filter((m) => !m.clusters.includes(cluster.id) && matchesSearch(m, search)).slice(0, 8)
        : [],
    [members, cluster, search],
  );
  const hasInfo = Boolean(
    cluster.about ||
      cluster.meeting_day ||
      cluster.meeting_time ||
      cluster.location ||
      cluster.contact_person ||
      cluster.contact_phone,
  );

  // Runs one change: shows a toast, reloads the page data, keeps errors inline.
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

  const handleEdit = () => {
    setForm({
      name: cluster.name,
      description: cluster.description,
      about: cluster.about,
      meeting_day: cluster.meeting_day,
      meeting_time: cluster.meeting_time,
      location: cluster.location,
      contact_person: cluster.contact_person,
      contact_phone: cluster.contact_phone,
    });
    setError("");
    setEditing(true);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async (e) => {
    e.preventDefault();
    if (await run(() => updateCluster(cluster.id, form), "Cluster saved")) setEditing(false);
  };

  const handleDelete = async () => {
    const { isConfirmed } = await Swal.fire({
      title: `Delete "${cluster.name}"?`,
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
    if (isConfirmed && (await run(() => deleteCluster(cluster.id), "Cluster deleted"))) {
      navigate("/dashboard/clusters");
    }
  };

  return (
    <div>
      <Link
        to="/dashboard/clusters"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-forest-800 hover:underline"
      >
        <ArrowLeft className="size-4" /> All clusters
      </Link>

      <header className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <span className="grid size-14 shrink-0 place-items-center rounded-full bg-forest-50 text-forest-700">
            <UsersRound className="size-6" />
          </span>
          <div>
            <h1 className="text-3xl font-semibold sm:text-4xl">{cluster.name}</h1>
            <p className="mt-1.5 flex flex-wrap items-center gap-2 text-muted">
              <span className="inline-flex items-center rounded-full bg-forest-100 px-2.5 py-0.5 text-xs font-semibold text-forest-800">
                {kindLabels[cluster.kind]}
              </span>
              {cluster.member_count} {cluster.member_count === 1 ? "member" : "members"}
            </p>
            {cluster.description && <p className="mt-2 max-w-2xl text-muted">{cluster.description}</p>}
          </div>
        </div>
        <div className="flex gap-2">
          {!editing && (
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-line bg-white px-3 py-1.5 text-sm font-semibold text-ink transition hover:border-forest-600 hover:text-forest-800 active:translate-y-px disabled:opacity-60"
              disabled={busy}
              onClick={handleEdit}
            >
              <Pencil className="size-4" />
              Edit information
            </button>
          )}
          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-clay-600 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-clay-700 active:translate-y-px disabled:opacity-60"
            disabled={busy}
            onClick={handleDelete}
          >
            <Trash2 className="size-4" />
            Delete
          </button>
        </div>
      </header>

      {error && (
        <p role="alert" className="mb-4 flex items-start gap-2 rounded-3xl bg-clay-100 px-3.5 py-2.5 text-sm text-clay-700">
          <CircleAlert className="mt-0.5 size-4 shrink-0" />
          {error}
        </p>
      )}

      <div className="grid gap-6 lg:grid-cols-5">
        <section className="lg:col-span-2">
          <div className="rounded-3xl border border-line bg-white p-5 shadow-card sm:p-6">
            {editing ? (
              <form className="space-y-4" onSubmit={handleSave}>
                <h2 className="text-lg font-semibold">Cluster information</h2>
                <div>
                  <label className="block">
                    <span className="mb-1.5 block text-sm font-medium">Name</span>
                    <input className="input" name="name" required value={form.name} onChange={handleChange} />
                  </label>
                </div>
                <div>
                  <label className="block">
                    <span className="mb-1.5 block text-sm font-medium">Short description</span>
                    <input
                      className="input"
                      name="description"
                      maxLength={255}
                      value={form.description}
                      onChange={handleChange}
                    />
                  </label>
                </div>
                <div>
                  <label className="block">
                    <span className="mb-1.5 block text-sm font-medium">About this cluster</span>
                    <textarea
                      className="input min-h-32"
                      name="about"
                      placeholder="What the group does, who it is for, how to join"
                      value={form.about}
                      onChange={handleChange}
                    />
                  </label>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-1.5 block text-sm font-medium">Meets on</span>
                    <input
                      className="input"
                      name="meeting_day"
                      placeholder="Wednesdays"
                      value={form.meeting_day}
                      onChange={handleChange}
                    />
                  </label>
                  <label className="block">
                    <span className="mb-1.5 block text-sm font-medium">Time</span>
                    <input
                      className="input"
                      name="meeting_time"
                      placeholder="7:00 pm"
                      value={form.meeting_time}
                      onChange={handleChange}
                    />
                  </label>
                </div>
                <div>
                  <label className="block">
                    <span className="mb-1.5 block text-sm font-medium">Where</span>
                    <input
                      className="input"
                      name="location"
                      placeholder="Place or area"
                      value={form.location}
                      onChange={handleChange}
                    />
                  </label>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-1.5 block text-sm font-medium">Contact person</span>
                    <input
                      className="input"
                      name="contact_person"
                      value={form.contact_person}
                      onChange={handleChange}
                    />
                  </label>
                  <label className="block">
                    <span className="mb-1.5 block text-sm font-medium">Contact phone</span>
                    <input
                      className="input"
                      name="contact_phone"
                      inputMode="tel"
                      value={form.contact_phone}
                      onChange={handleChange}
                    />
                  </label>
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-forest-900 px-4 py-2.5 text-sm font-semibold text-paper shadow-card transition hover:bg-forest-800 active:translate-y-px disabled:opacity-60"
                    disabled={busy}
                  >
                    {busy && <LoaderCircle className="size-4 animate-spin" />}
                    Save
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-line bg-white px-4 py-2.5 text-sm font-semibold text-ink transition hover:border-forest-600 hover:text-forest-800 active:translate-y-px"
                    disabled={busy}
                    onClick={() => setEditing(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <>
                <h2 className="text-lg font-semibold">About</h2>
                {!hasInfo ? (
                  <p className="mt-2 text-sm text-muted">
                    No information yet. Use “Edit information” to say what this cluster is, when and where it meets,
                    and who to contact.
                  </p>
                ) : (
                  <div className="mt-3 space-y-4">
                    {cluster.about && <p className="whitespace-pre-line text-sm leading-relaxed">{cluster.about}</p>}
                    <ul className="space-y-3 text-sm">
                      {(cluster.meeting_day || cluster.meeting_time) && (
                        <li className="flex items-start gap-3">
                          <CalendarClock className="mt-0.5 size-4 shrink-0 text-forest-700" />
                          <span>
                            <span className="block text-xs text-muted">Meets</span>
                            {[cluster.meeting_day, cluster.meeting_time].filter(Boolean).join(" · ")}
                          </span>
                        </li>
                      )}
                      {cluster.location && (
                        <li className="flex items-start gap-3">
                          <MapPin className="mt-0.5 size-4 shrink-0 text-forest-700" />
                          <span>
                            <span className="block text-xs text-muted">Where</span>
                            {cluster.location}
                          </span>
                        </li>
                      )}
                      {cluster.contact_person && (
                        <li className="flex items-start gap-3">
                          <User className="mt-0.5 size-4 shrink-0 text-forest-700" />
                          <span>
                            <span className="block text-xs text-muted">Contact person</span>
                            {cluster.contact_person}
                          </span>
                        </li>
                      )}
                      {cluster.contact_phone && (
                        <li className="flex items-start gap-3">
                          <Phone className="mt-0.5 size-4 shrink-0 text-forest-700" />
                          <span>
                            <span className="block text-xs text-muted">Phone</span>
                            <a className="hover:underline" href={`tel:${cluster.contact_phone.replace(/\s+/g, "")}`}>
                              {cluster.contact_phone}
                            </a>
                          </span>
                        </li>
                      )}
                    </ul>
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        <section className="lg:col-span-3">
          <div className="rounded-3xl border border-line bg-white p-5 shadow-card sm:p-6">
            <h2 className="mb-3 text-lg font-semibold">Add people</h2>
            <div className="relative">
              <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted" />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Type a name, email or phone"
                aria-label="Type a name, email or phone"
                className="input pl-10"
              />
            </div>
            {candidates.length > 0 && (
              <ul className="mt-2 divide-y divide-line/70 rounded-3xl border border-line px-3">
                {candidates.map((m) => (
                  <li key={m.id} className="flex items-center justify-between gap-3 py-2.5">
                    <span className="flex min-w-0 items-center gap-3">
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
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-medium">{fullName(m)}</span>
                        <span className="block truncate text-xs text-muted">{m.phone || m.email}</span>
                      </span>
                    </span>
                    <button
                      type="button"
                      className="inline-flex items-center justify-center gap-2 rounded-full border border-line bg-white px-3 py-1.5 text-sm font-semibold text-ink transition hover:border-forest-600 hover:text-forest-800 active:translate-y-px disabled:opacity-60"
                      disabled={busy}
                      aria-label={`Add ${fullName(m)}`}
                      onClick={() =>
                        run(() => changeClusterMembers(cluster.id, { add: [m.id] }), `${fullName(m)} added`)
                      }
                    >
                      <UserPlus className="size-4" />
                      Add
                    </button>
                  </li>
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
                  <li key={m.id} className="flex items-center justify-between gap-3 py-2.5">
                    <span className="flex min-w-0 items-center gap-3">
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
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-medium">{fullName(m)}</span>
                        <span className="block truncate text-xs text-muted">{m.phone || m.email}</span>
                      </span>
                    </span>
                    <button
                      type="button"
                      className="inline-flex items-center justify-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold text-forest-800 transition hover:bg-forest-50 active:translate-y-px disabled:opacity-60"
                      disabled={busy}
                      aria-label={`Remove ${fullName(m)}`}
                      onClick={() =>
                        run(() => changeClusterMembers(cluster.id, { remove: [m.id] }), `${fullName(m)} removed`)
                      }
                    >
                      <UserMinus className="size-4" />
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

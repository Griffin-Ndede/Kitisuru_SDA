import React, { useState } from "react";
import { Link, useLoaderData, useNavigate, useRevalidator } from "react-router";
import { CalendarClock, ChevronRight, CircleAlert, LoaderCircle, MapPin, Plus, UsersRound } from "lucide-react";
import { createCluster } from "../../Api";
import { errorMessage } from "../../Api/client";
import { useToast } from "../../Context/ToastContext";
import { kindLabels, newKinds } from "./memberHelpers";

// Admin only: every location group and fundraising group. Each card opens
// that cluster's own page, where its information and members are kept.
export default function Clusters() {
  const { clusters } = useLoaderData();
  const navigate = useNavigate();
  const revalidator = useRevalidator();
  const toast = useToast();
  const [form, setForm] = useState({ name: "", kind: "prayer_cell" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const made = await createCluster(form);
      toast.success(`${form.name} created`);
      setForm({ name: "", kind: form.kind });
      revalidator.revalidate();
      // straight to the new cluster's page so its information can be filled in
      if (made?.id) navigate(`/dashboard/clusters/${made.id}`);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <header className="mb-6">
        <h1 className="text-3xl font-semibold sm:text-4xl">Clusters</h1>
        <p className="mt-1.5 max-w-2xl text-muted">
          Groups by location (prayer cells) and for fundraising. A member can belong to several. Open one to see and
          edit its information and members.
        </p>
      </header>

      <form
        className="mb-8 flex flex-wrap items-end gap-3 rounded-3xl border border-line bg-white p-5 shadow-card"
        onSubmit={handleCreate}
      >
        <div className="min-w-48 flex-1">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium">New cluster</span>
            <input
              className="input"
              required
              placeholder="Name, for example Kitisuru Cell"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </label>
        </div>
        <div className="min-w-44">
          <select
            className="input"
            aria-label="Kind"
            value={form.kind}
            onChange={(e) => setForm({ ...form, kind: e.target.value })}
          >
            {newKinds.map((value) => (
              <option key={value} value={value}>
                {kindLabels[value]}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-forest-900 px-4 py-2.5 text-sm font-semibold text-paper shadow-card transition hover:bg-forest-800 active:translate-y-px disabled:opacity-60"
          disabled={busy}
        >
          {busy ? <LoaderCircle className="size-4 animate-spin" /> : <Plus className="size-4" />}
          Create
        </button>
        {error && (
          <p
            role="alert"
            className="flex w-full items-start gap-2 rounded-3xl bg-clay-100 px-3.5 py-2.5 text-sm text-clay-700"
          >
            <CircleAlert className="mt-0.5 size-4 shrink-0" />
            {error}
          </p>
        )}
      </form>

      {clusters.length === 0 ? (
        <div className="flex flex-col items-center rounded-3xl border border-line bg-white px-6 py-12 text-center shadow-card">
          <span className="arch grid h-16 w-14 place-items-center bg-forest-50 text-forest-600">
            <UsersRound className="size-6" />
          </span>
          <h2 className="mt-4 text-lg font-semibold">No clusters yet</h2>
          <p className="mt-1 max-w-sm text-sm text-muted">Create the first one above.</p>
        </div>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {clusters.map((c) => (
            <li key={c.id}>
              <Link
                to={`/dashboard/clusters/${c.id}`}
                className="group flex h-full flex-col rounded-3xl border border-line bg-white p-5 shadow-card transition hover:border-forest-600"
              >
                <span className="flex items-start justify-between gap-3">
                  <span className="min-w-0">
                    <span className="block truncate font-display text-xl font-semibold">{c.name}</span>
                    <span className="mt-1 inline-flex items-center rounded-full bg-forest-100 px-2.5 py-0.5 text-xs font-semibold text-forest-800">
                      {kindLabels[c.kind]}
                    </span>
                  </span>
                  <ChevronRight className="size-5 shrink-0 text-muted transition group-hover:translate-x-0.5 group-hover:text-forest-800" />
                </span>
                {c.description && <span className="mt-3 line-clamp-2 text-sm text-muted">{c.description}</span>}
                <span className="mt-auto space-y-1 pt-4 text-sm text-muted">
                  <span className="flex items-center gap-2">
                    <UsersRound className="size-4" />
                    {c.member_count} {c.member_count === 1 ? "member" : "members"}
                  </span>
                  {(c.meeting_day || c.meeting_time) && (
                    <span className="flex items-center gap-2">
                      <CalendarClock className="size-4" />
                      {[c.meeting_day, c.meeting_time].filter(Boolean).join(" · ")}
                    </span>
                  )}
                  {c.location && (
                    <span className="flex items-center gap-2">
                      <MapPin className="size-4" />
                      {c.location}
                    </span>
                  )}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

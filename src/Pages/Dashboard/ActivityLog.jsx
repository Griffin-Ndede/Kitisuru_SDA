import React, { useState } from "react";
import { useLoaderData } from "react-router";
import { CircleAlert, Search } from "lucide-react";
import { getAuditLog } from "../../Api";
import { errorMessage } from "../../Api/client";
import { fullName } from "./memberHelpers";

// Admin only. Every change an admin makes is written here automatically: who did it, what
// they did and when. It is how admins can tell who approved or changed something.
// Members never see this page, and the backend refuses them too.
export default function ActivityLog() {
  const { log, admins } = useLoaderData();
  const [entries, setEntries] = useState(log.results);
  const [hasMore, setHasMore] = useState(log.has_more);
  const [nextBefore, setNextBefore] = useState(log.next_before);
  const [actor, setActor] = useState("");
  const [search, setSearch] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  // Ask the backend for a page; "more" adds older entries under the ones already shown
  const load = async ({ actor: who = actor, search: words = search, more = false } = {}) => {
    setBusy(true);
    setError("");
    try {
      const page = await getAuditLog({ actor: who, search: words.trim(), before: more ? nextBefore : "" });
      setEntries((current) => (more ? [...current, ...page.results] : page.results));
      setHasMore(page.has_more);
      setNextBefore(page.next_before);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  const handleActor = (e) => {
    setActor(e.target.value);
    load({ actor: e.target.value });
  };
  const handleSearch = (e) => {
    e.preventDefault();
    load();
  };

  const dayOf = (iso) =>
    new Date(iso).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  const timeOf = (iso) => new Date(iso).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });

  // Group the entries by the day they happened, keeping newest first
  const days = [];
  entries.forEach((entry) => {
    const day = dayOf(entry.created_at);
    if (!days.length || days[days.length - 1].day !== day) days.push({ day, items: [] });
    days[days.length - 1].items.push(entry);
  });

  return (
    <div>
      <header className="mb-6">
        <h1 className="text-3xl font-semibold sm:text-4xl">Activity log</h1>
        <p className="mt-1.5 max-w-2xl text-muted">
          Who did what. Every change an admin makes is recorded here automatically, so you can see who approved or changed
          something. Only admins can see this page.
        </p>
      </header>

      <form onSubmit={handleSearch} className="mb-6 flex flex-wrap gap-3">
        <select className="input !w-auto" value={actor} onChange={handleActor} aria-label="Show actions by">
          <option value="">All admins</option>
          {admins.map((a) => (
            <option key={a.id} value={a.id}>
              {fullName(a)}
            </option>
          ))}
        </select>
        <div className="relative min-w-56 flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted" />
          <input
            className="input !pl-10"
            type="search"
            placeholder="Search, for example a member's name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button
          type="submit"
          disabled={busy}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-forest-900 px-4 py-2.5 text-sm font-semibold text-paper shadow-card transition hover:bg-forest-800 active:translate-y-px disabled:opacity-60"
        >
          Search
        </button>
      </form>

      {error && (
        <p role="alert" className="mb-4 flex items-start gap-2 rounded-3xl bg-clay-100 px-3.5 py-2.5 text-sm text-clay-700">
          <CircleAlert className="mt-0.5 size-4 shrink-0" />
          {error}
        </p>
      )}

      {days.length === 0 && (
        <p className="rounded-3xl border border-line bg-paper px-5 py-8 text-center text-muted">
          Nothing to show yet. Changes made by admins will appear here.
        </p>
      )}

      <div className="space-y-6">
        {days.map(({ day, items }) => (
          <section key={day}>
            <h2 className="mb-2 text-sm font-semibold text-muted">{day}</h2>
            <ul className="divide-y divide-line overflow-hidden rounded-3xl border border-line bg-paper">
              {items.map((entry) => (
                <li key={entry.id} className="flex flex-wrap items-baseline gap-x-4 gap-y-1 px-5 py-3.5 text-sm">
                  <span className="w-12 shrink-0 text-muted">{timeOf(entry.created_at)}</span>
                  <span className="font-semibold">{entry.actor_name}</span>
                  <span className="min-w-0 flex-1 text-ink">{entry.summary}</span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      {hasMore && (
        <div className="mt-6 text-center">
          <button
            type="button"
            disabled={busy}
            onClick={() => load({ more: true })}
            className="inline-flex items-center justify-center rounded-full border border-line bg-paper px-5 py-2.5 text-sm font-semibold transition hover:bg-paper-deep disabled:opacity-60"
          >
            {busy ? "Loading…" : "Show older"}
          </button>
        </div>
      )}
    </div>
  );
}

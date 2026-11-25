import React, { useState, useEffect } from "react";
import { Link, useLoaderData, useRevalidator } from "react-router";
import { Megaphone, Pencil, Pin, Plus, Trash2, X, CircleAlert } from "lucide-react";
import { deleteAnnouncement } from "../../Api";
import { errorMessage } from "../../Api/client";
import { useToast } from "../../Context/ToastContext";
import { useUser } from "../../Context/UserContext";
import AnnouncementForm from "./AnnouncementForm";
import { formatDate } from "./ministryHelpers";

// What the church office wants every member to know. Everyone approved reads;
// admins post, edit and remove.
export default function Announcements() {
  const { announcements, ministries } = useLoaderData();
  const { isAdmin } = useUser();
  const revalidator = useRevalidator();
  const toast = useToast();
  const [dialog, setDialog] = useState(null); // "new" or an announcement
  const [error, setError] = useState("");
  const [filter, setFilter] = useState(""); // "" = all, "church" = the whole church, or a ministry id

  const shown = announcements.filter(
    (item) => !filter || (filter === "church" ? !item.ministry : item.ministry === Number(filter)),
  );

  const handleDelete = async (item) => {
    if (!window.confirm(`Remove "${item.title}"?`)) return;
    setError("");
    try {
      await deleteAnnouncement(item.id);
      toast.success("Announcement removed");
      revalidator.revalidate();
    } catch (err) {
      setError(errorMessage(err));
    }
  };

  const saved = () => {
    setDialog(null);
    revalidator.revalidate();
  };

  // A box over the page closes on Escape and stops the page behind it from scrolling
  useEffect(() => {
    if (!dialog) return undefined;
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
          <h1 className="text-3xl font-semibold sm:text-4xl">Announcements</h1>
          <p className="mt-1.5 max-w-2xl text-muted">News and notices from the church office.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {isAdmin && (
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-full font-semibold transition active:translate-y-px disabled:opacity-60 bg-forest-900 text-paper hover:bg-forest-800 shadow-card px-4 py-2.5 text-sm"
              onClick={() => setDialog("new")}
            >
              <Plus className="size-4" />
              New announcement
            </button>
          )}
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

      {ministries.length > 0 && (
        <div className="mb-4 max-w-xs">
          <select
            className="input"
            aria-label="Filter by ministry"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="">All announcements</option>
            <option value="church">Whole church</option>
            {ministries.map((m) => (
              <option key={m.id} value={m.id}>
                {m.title}
              </option>
            ))}
          </select>
        </div>
      )}

      {shown.length === 0 ? (
        <div className="rounded-card border border-line bg-white shadow-card p-5 sm:p-6">
          <div className="flex flex-col items-center px-6 py-12 text-center">
            <span className="arch grid h-16 w-14 place-items-center bg-forest-50 text-forest-600">
              <Megaphone className="size-6" />
            </span>
            <h3 className="mt-4 text-lg font-semibold">No announcements right now</h3>
            <p className="mt-1 max-w-sm text-sm text-muted">Check back soon.</p>
          </div>
        </div>
      ) : (
        <ul className="space-y-4">
          {shown.map((item) => (
            <li key={item.id}>
              <div
                className={`rounded-card border border-line bg-white shadow-card p-5 sm:p-6 ${item.pinned ? "!border-marigold-400" : ""}`}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-xl font-semibold">{item.title}</h2>
                      {item.pinned && (
                        <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-marigold-100 text-marigold-600">
                          <Pin className="mr-1 size-3" />
                          Pinned
                        </span>
                      )}
                      {item.ministry && (
                        <Link
                          to={`/dashboard/ministries/${item.ministry}`}
                          className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-forest-100 text-forest-800 hover:underline"
                        >
                          {item.ministry_title}
                        </Link>
                      )}
                      {item.is_expired && (
                        <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-paper-deep text-muted">
                          Expired
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-muted">
                      {formatDate(item.created_at)}
                      {item.author_name && ` · ${item.author_name}`}
                      {item.expires_on && ` · shown until ${formatDate(item.expires_on)}`}
                    </p>
                  </div>
                  {isAdmin && (
                    <div className="flex gap-2">
                      <button
                        type="button"
                        className="inline-flex items-center justify-center gap-2 rounded-full font-semibold transition active:translate-y-px disabled:opacity-60 border border-line bg-white text-ink hover:border-forest-600 hover:text-forest-800 px-3 py-1.5 text-sm"
                        onClick={() => setDialog(item)}
                        aria-label={`Edit ${item.title}`}
                      >
                        <Pencil className="size-4" />
                        Edit
                      </button>
                      <button
                        type="button"
                        className="inline-flex items-center justify-center gap-2 rounded-full font-semibold transition active:translate-y-px disabled:opacity-60 text-forest-800 hover:bg-forest-50 px-3 py-1.5 text-sm"
                        onClick={() => handleDelete(item)}
                        aria-label={`Remove ${item.title}`}
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  )}
                </div>
                <p className="mt-3 whitespace-pre-line leading-relaxed text-ink/90">{item.body}</p>
              </div>
            </li>
          ))}
        </ul>
      )}

      {dialog && (
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
            aria-label={dialog === "new" ? "New announcement" : "Edit announcement"}
            className="rise relative flex max-h-[92vh] w-full flex-col rounded-t-3xl bg-white shadow-lift outline-none sm:rounded-3xl sm:max-w-xl"
          >
            <header className="flex items-start justify-between gap-4 border-b border-line px-5 py-4 sm:px-6">
              <div>
                <h2 className="text-xl font-semibold">{dialog === "new" ? "New announcement" : "Edit announcement"}</h2>
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
              <AnnouncementForm
                ministries={ministries}
                announcement={dialog === "new" ? null : dialog}
                onSaved={saved}
                onClose={() => setDialog(null)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useMemo, useState, useEffect } from "react";
import { Link, useLoaderData, useNavigate, useRevalidator } from "react-router";
import {
  ArrowLeft,
  Calendar,
  CircleCheck,
  Clock,
  HeartHandshake,
  Mail,
  MapPin,
  Megaphone,
  Pencil,
  Pin,
  Plus,
  Phone,
  Trash2,
  UserMinus,
  UserPlus,
  X,
  Search,
  CircleAlert,
} from "lucide-react";
import { changeMinistryMembers, deleteAnnouncement, deleteMinistry } from "../../Api";
import Swal from "sweetalert2";
import { errorMessage } from "../../Api/client";
import { useToast } from "../../Context/ToastContext";
import AnnouncementForm from "./AnnouncementForm";
import MinistryForm from "./MinistryForm";
import { formatDate, photoUrl } from "./ministryHelpers";
import { fullName, matchesSearch } from "./memberHelpers";

// One ministry: what it is, its programs, events, photos and contact people.
// Admins also edit it and manage who belongs to it.
export default function MinistryDetail() {
  const { ministry, members, announcements, leaders } = useLoaderData();
  const revalidator = useRevalidator();
  const navigate = useNavigate();
  const toast = useToast();
  const [editing, setEditing] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [announcementDialog, setAnnouncementDialog] = useState(null); // "new" or an announcement
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const isAdmin = Boolean(ministry.members);
  const inMinistry = useMemo(() => new Set((ministry.members || []).map((m) => m.id)), [ministry]);
  const candidates = useMemo(
    () => (search.trim() ? members.filter((m) => !inMinistry.has(m.id) && matchesSearch(m, search)).slice(0, 8) : []),
    [members, inMinistry, search],
  );
  const events = [...(ministry.events || [])].sort((a, b) => new Date(a.start_date) - new Date(b.start_date));

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

  const handleDelete = async () => {
    const { isConfirmed } = await Swal.fire({
      title: `Delete the ${ministry.title} ministry?`,
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
    if (isConfirmed && (await run(() => deleteMinistry(ministry.id), "Ministry deleted"))) {
      navigate("/dashboard/ministries");
    }
  };

  const handleDeleteAnnouncement = async (item) => {
    const { isConfirmed } = await Swal.fire({
      title: `Remove "${item.title}"?`,
      text: "Members will no longer see it.",
      icon: "warning",
      iconColor: "#ffc700", // the website's yellow
      showCancelButton: true,
      confirmButtonText: "Yes, remove",
      cancelButtonText: "Keep it",
      confirmButtonColor: "#b04a2a", // red: this removes something
      cancelButtonColor: "#6b7280", // grey
      reverseButtons: true,
      focusCancel: true,
    });
    if (isConfirmed) await run(() => deleteAnnouncement(item.id), "Announcement removed");
  };

  const modalOpen = Boolean(editing || photo || announcementDialog);
  // A box over the page closes on Escape and stops the page behind it from scrolling
  useEffect(() => {
    if (!modalOpen) return undefined;
    const onKey = (event) => {
      if (event.key !== "Escape") return;
      if (photo) setPhoto(null);
      else if (announcementDialog) setAnnouncementDialog(null);
      else setEditing(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [modalOpen, photo, announcementDialog]);

  return (
    <div>
      <Link
        to="/dashboard/ministries"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-forest-800 hover:underline"
      >
        <ArrowLeft className="size-4" /> All ministries
      </Link>

      <header className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <span className="grid size-14 shrink-0 place-items-center rounded-full bg-forest-50 text-forest-700">
            <HeartHandshake className="size-7" />
          </span>
          <div>
            <h1 className="text-3xl font-semibold sm:text-4xl">{ministry.title}</h1>
            {ministry.mission && <p className="mt-1.5 max-w-2xl text-muted">{ministry.mission}</p>}
          </div>
        </div>
        {isAdmin && (
          <div className="flex gap-2">
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-full font-semibold transition active:translate-y-px disabled:opacity-60 border border-line bg-white text-ink hover:border-forest-600 hover:text-forest-800 px-3 py-1.5 text-sm"
              onClick={() => setEditing(true)}
            >
              <Pencil className="size-4" />
              Edit
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
        )}
      </header>
      <div className="mb-4">
        {error && (
          <p role="alert" className="flex items-start gap-2 rounded-3xl bg-clay-100 px-3.5 py-2.5 text-sm text-clay-700">
            <CircleAlert className="mt-0.5 size-4 shrink-0" />
            {error}
          </p>
        )}
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <section>
            <h2 className="mb-3 text-2xl font-semibold">About us</h2>
            <p className="max-w-2xl leading-relaxed text-ink/80">{ministry.description || "No description yet."}</p>
          </section>

          {leaders.length > 0 && (
            <section>
              <h2 className="mb-3 text-2xl font-semibold">Leaders</h2>
              <ul className="grid gap-3 sm:grid-cols-2">
                {leaders.flatMap((position) =>
                  position.holders.map((holder) => (
                    <li key={holder.assignment} className="rounded-3xl border border-line bg-white px-4 py-3 shadow-card">
                      <p className="font-medium">{holder.name}</p>
                      <p className="text-xs text-muted">
                        {position.title}, until {formatDate(holder.term_end)}
                      </p>
                    </li>
                  )),
                )}
              </ul>
            </section>
          )}

          <section>
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-2xl font-semibold">Announcements</h2>
              {isAdmin && (
                <button
                  type="button"
                  className="inline-flex items-center justify-center gap-2 rounded-full font-semibold transition active:translate-y-px disabled:opacity-60 border border-line bg-white text-ink hover:border-forest-600 hover:text-forest-800 px-3 py-1.5 text-sm"
                  onClick={() => setAnnouncementDialog("new")}
                >
                  <Plus className="size-4" />
                  New announcement
                </button>
              )}
            </div>
            {announcements.length === 0 ? (
              <p className="flex items-center gap-2 text-sm text-muted">
                <Megaphone className="size-4" />
                No announcements for this ministry right now.
              </p>
            ) : (
              <ul className="space-y-4">
                {announcements.map((item) => (
                  <li
                    key={item.id}
                    className={`rounded-3xl border border-line bg-white shadow-card p-5 sm:p-6 ${item.pinned ? "!border-marigold-400" : ""}`}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-semibold">{item.title}</h3>
                          {item.pinned && (
                            <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-marigold-100 text-marigold-600">
                              <Pin className="mr-1 size-3" />
                              Pinned
                            </span>
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
                            disabled={busy}
                            aria-label={`Edit ${item.title}`}
                            onClick={() => setAnnouncementDialog(item)}
                          >
                            <Pencil className="size-4" />
                            Edit
                          </button>
                          <button
                            type="button"
                            className="inline-flex items-center justify-center gap-2 rounded-full font-semibold transition active:translate-y-px disabled:opacity-60 text-forest-800 hover:bg-forest-50 px-3 py-1.5 text-sm"
                            disabled={busy}
                            aria-label={`Remove ${item.title}`}
                            onClick={() => handleDeleteAnnouncement(item)}
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                      )}
                    </div>
                    <p className="mt-3 whitespace-pre-line leading-relaxed text-ink/90">{item.body}</p>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold">Programs</h2>
            {ministry.programs.length === 0 ? (
              <p className="text-sm text-muted">No programs listed yet.</p>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {ministry.programs.map((p) => (
                  <div className="rounded-3xl border border-line bg-white shadow-card p-5 sm:p-6" key={p.id}>
                    <h3 className="text-lg font-semibold">{p.title}</h3>
                    <p className="mt-1 text-sm text-muted">{p.description}</p>
                    <p className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-forest-800">
                      <Clock className="size-4" />
                      {p.schedule}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold">Events</h2>
            {events.length === 0 ? (
              <p className="text-sm text-muted">No events listed yet.</p>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {events.map((e) => (
                  <div className="rounded-3xl border border-line bg-white shadow-card p-5 sm:p-6" key={e.id}>
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-lg font-semibold">{e.title}</h3>
                      {new Date(e.end_date) < new Date() && (
                        <CircleCheck className="size-5 shrink-0 text-forest-600" aria-label="Past event" />
                      )}
                    </div>
                    <p className="mt-1 text-sm text-muted">{e.description}</p>
                    <p className="mt-3 flex items-center gap-1.5 text-sm text-forest-800">
                      <MapPin className="size-4" />
                      {e.location}
                    </p>
                    <p className="mt-1 flex items-center gap-1.5 text-sm text-forest-800">
                      <Calendar className="size-4" />
                      {formatDate(e.start_date)} to {formatDate(e.end_date)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>

          {ministry.gallery_images.length > 0 && (
            <section>
              <h2 className="mb-3 text-2xl font-semibold">Photos</h2>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {ministry.gallery_images.map((g, i) => (
                  <button
                    key={g.id ?? i}
                    type="button"
                    onClick={() => setPhoto(photoUrl(g.image))}
                    className="overflow-hidden rounded-3xl"
                  >
                    <img
                      src={photoUrl(g.image)}
                      alt={`${ministry.title} photo ${i + 1}`}
                      loading="lazy"
                      className="aspect-square w-full object-cover transition hover:scale-105"
                    />
                  </button>
                ))}
              </div>
            </section>
          )}
        </div>

        <aside className="space-y-6">
          <div className="rounded-3xl border border-line bg-white shadow-card p-5 sm:p-6">
            <h2 className="mb-3 text-xl font-semibold">Get in touch</h2>
            {ministry.contacts.length === 0 ? (
              <p className="text-sm text-muted">No contact people listed yet.</p>
            ) : (
              <ul className="space-y-4">
                {ministry.contacts.map((c) => (
                  <li key={c.id} className="flex items-start gap-3">
                    <span
                      className="size-10 text-sm grid shrink-0 place-items-center rounded-full bg-forest-100 font-semibold text-forest-800"
                      aria-hidden="true"
                    >
                      {(c.name || "")
                        .trim()
                        .split(/\s+/)
                        .slice(0, 2)
                        .map((part) => part[0]?.toUpperCase())
                        .join("") || "?"}
                    </span>
                    <div className="min-w-0 text-sm">
                      <p className="font-semibold">{c.name}</p>
                      {c.role && <p className="text-muted">{c.role}</p>}
                      {c.phone && (
                        <a href={`tel:${c.phone}`} className="mt-1 flex items-center gap-1.5 text-forest-800">
                          <Phone className="size-3.5" />
                          {c.phone}
                        </a>
                      )}
                      {c.email && (
                        <a href={`mailto:${c.email}`} className="flex items-center gap-1.5 break-all text-forest-800">
                          <Mail className="size-3.5" />
                          {c.email}
                        </a>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {isAdmin && (
            <div className="rounded-3xl border border-line bg-white shadow-card p-5 sm:p-6">
              <h2 className="mb-3 text-xl font-semibold">Members ({ministry.members.length})</h2>
              <div className="relative">
                <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted" />
                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder={"Find someone to add"}
                  aria-label={"Find someone to add"}
                  className="input pl-10"
                />
              </div>
              {candidates.length > 0 && (
                <ul className="mt-2 divide-y divide-line/70 rounded-3xl border border-line px-3">
                  {candidates.map((m) => (
                    <li key={m.id} className="flex items-center justify-between gap-2 py-2">
                      <span className="min-w-0 truncate text-sm">{fullName(m)}</span>
                      <button
                        type="button"
                        className="inline-flex items-center justify-center gap-2 rounded-full font-semibold transition active:translate-y-px disabled:opacity-60 border border-line bg-white text-ink hover:border-forest-600 hover:text-forest-800 px-3 py-1.5 text-sm"
                        disabled={busy}
                        aria-label={`Add ${fullName(m)}`}
                        onClick={() =>
                          run(() => changeMinistryMembers(ministry.id, { add: [m.id] }), `${fullName(m)} added`)
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
              {ministry.members.length === 0 ? (
                <p className="mt-3 text-sm text-muted">No one yet.</p>
              ) : (
                <ul className="mt-3 divide-y divide-line/70">
                  {ministry.members.map((m) => (
                    <li key={m.id} className="flex items-center justify-between gap-2 py-2.5">
                      <span className="flex min-w-0 items-center gap-2.5">
                        <span
                          className="size-8 text-xs grid shrink-0 place-items-center rounded-full bg-forest-100 font-semibold text-forest-800"
                          aria-hidden="true"
                        >
                          {(m.name || "")
                            .trim()
                            .split(/\s+/)
                            .slice(0, 2)
                            .map((part) => part[0]?.toUpperCase())
                            .join("") || "?"}
                        </span>
                        <span className="min-w-0">
                          <span className="block truncate text-sm font-medium">{m.name}</span>
                          <span className="block truncate text-xs text-muted">{m.phone || m.email}</span>
                        </span>
                      </span>
                      <button
                        type="button"
                        className="inline-flex items-center justify-center gap-2 rounded-full font-semibold transition active:translate-y-px disabled:opacity-60 text-forest-800 hover:bg-forest-50 px-3 py-1.5 text-sm"
                        disabled={busy}
                        aria-label={`Remove ${m.name}`}
                        onClick={() =>
                          run(() => changeMinistryMembers(ministry.id, { remove: [m.id] }), `${m.name} removed`)
                        }
                      >
                        <UserMinus className="size-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </aside>
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6">
          <div
            className="absolute inset-0 bg-forest-950/50 backdrop-blur-[2px]"
            onClick={() => setEditing(false)}
            aria-hidden="true"
          />
          <div
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-label={`Edit ${ministry.title}`}
            className="rise relative flex max-h-[92vh] w-full flex-col rounded-t-3xl bg-white shadow-lift outline-none sm:rounded-3xl sm:max-w-xl"
          >
            <header className="flex items-start justify-between gap-4 border-b border-line px-5 py-4 sm:px-6">
              <div>
                <h2 className="text-xl font-semibold">{`Edit ${ministry.title}`}</h2>
              </div>
              <button
                type="button"
                onClick={() => setEditing(false)}
                aria-label="Close"
                className="rounded-full p-1.5 text-muted hover:bg-paper-deep hover:text-ink"
              >
                <X className="size-5" />
              </button>
            </header>
            <div className="overflow-y-auto px-5 py-5 sm:px-6">
              <MinistryForm
                ministry={ministry}
                onClose={() => setEditing(false)}
                onSaved={() => {
                  setEditing(false);
                  revalidator.revalidate();
                }}
              />
            </div>
          </div>
        </div>
      )}
      {announcementDialog && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6">
          <div
            className="absolute inset-0 bg-forest-950/50 backdrop-blur-[2px]"
            onClick={() => setAnnouncementDialog(null)}
            aria-hidden="true"
          />
          <div
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-label={announcementDialog === "new" ? "New announcement" : "Edit announcement"}
            className="rise relative flex max-h-[92vh] w-full flex-col rounded-t-3xl bg-white shadow-lift outline-none sm:rounded-3xl sm:max-w-xl"
          >
            <header className="flex items-start justify-between gap-4 border-b border-line px-5 py-4 sm:px-6">
              <div>
                <h2 className="text-xl font-semibold">
                  {announcementDialog === "new" ? "New announcement" : "Edit announcement"}
                </h2>
                <p className="mt-0.5 text-sm text-muted">For the {ministry.title} ministry</p>
              </div>
              <button
                type="button"
                onClick={() => setAnnouncementDialog(null)}
                aria-label="Close"
                className="rounded-full p-1.5 text-muted hover:bg-paper-deep hover:text-ink"
              >
                <X className="size-5" />
              </button>
            </header>
            <div className="overflow-y-auto px-5 py-5 sm:px-6">
              <AnnouncementForm
                ministry={ministry.id}
                announcement={announcementDialog === "new" ? null : announcementDialog}
                onClose={() => setAnnouncementDialog(null)}
                onSaved={() => {
                  setAnnouncementDialog(null);
                  revalidator.revalidate();
                }}
              />
            </div>
          </div>
        </div>
      )}
      {photo && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6">
          <div
            className="absolute inset-0 bg-forest-950/50 backdrop-blur-[2px]"
            onClick={() => setPhoto(null)}
            aria-hidden="true"
          />
          <div
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-label={ministry.title}
            className="rise relative flex max-h-[92vh] w-full flex-col rounded-t-3xl bg-white shadow-lift outline-none sm:rounded-3xl sm:max-w-3xl"
          >
            <header className="flex items-start justify-between gap-4 border-b border-line px-5 py-4 sm:px-6">
              <div>
                <h2 className="text-xl font-semibold">{ministry.title}</h2>
              </div>
              <button
                type="button"
                onClick={() => setPhoto(null)}
                aria-label="Close"
                className="rounded-full p-1.5 text-muted hover:bg-paper-deep hover:text-ink"
              >
                <X className="size-5" />
              </button>
            </header>
            <div className="overflow-y-auto px-5 py-5 sm:px-6">
              <img src={photo} alt="" className="mx-auto max-h-[70vh] rounded-3xl object-contain" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

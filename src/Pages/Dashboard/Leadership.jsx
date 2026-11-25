import React, { useEffect, useMemo, useState } from "react";
import { useLoaderData, useRevalidator } from "react-router";
import { BadgeCheck, CircleAlert, Clock, Pencil, Plus, Trash2, UserPlus, X } from "lucide-react";
import Swal from "sweetalert2";
import {
  createAssignment,
  createPosition,
  deleteAssignment,
  deletePosition,
  updateAssignment,
  updatePosition,
} from "../../Api";
import { errorMessage } from "../../Api/client";
import { useToast } from "../../Context/ToastContext";
import { fullName } from "./memberHelpers";
import { formatDate } from "./ministryHelpers";

// Admin only. The church elects its leaders every two years: admins create the position
// titles (Elder, Treasurer...), appoint members to them, and end terms when an election
// changes things. One title can have several people. Every member sees the result on
// the "Our leaders" page.
export default function Leadership() {
  const { positions, members, ministries } = useLoaderData();
  const revalidator = useRevalidator();
  const toast = useToast();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [positionDialog, setPositionDialog] = useState(null); // "new" or a position
  const [positionForm, setPositionForm] = useState({ title: "", ministry: "" });
  const [appointDialog, setAppointDialog] = useState(null); // the position being filled
  const [appointForm, setAppointForm] = useState({ member: "", start_date: "", end_date: "", give_admin: false });

  const membersById = useMemo(() => Object.fromEntries(members.map((m) => [m.id, m])), [members]);
  const people = useMemo(
    () =>
      members
        .filter((m) => m.is_active)
        .map((m) => ({ id: m.id, name: fullName(m), role: m.role }))
        .sort((a, b) => a.name.localeCompare(b.name)),
    [members],
  );
  // Terms that end within three months, so the church can plan its next elections early
  const endingSoon = positions.flatMap((p) =>
    p.holders.filter((h) => h.ends_soon).map((h) => ({ ...h, position: p.title })),
  );

  const changePosition = (e) => setPositionForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  const changeAppoint = (e) => {
    const { name, value, type, checked } = e.target;
    setAppointForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const openPosition = (position) => {
    setError("");
    setPositionForm(
      position === "new"
        ? { title: "", ministry: "" }
        : { title: position.title, ministry: position.ministry ? String(position.ministry) : "" },
    );
    setPositionDialog(position);
  };

  const savePosition = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    const details = { title: positionForm.title.trim(), ministry: positionForm.ministry ? Number(positionForm.ministry) : null };
    try {
      if (positionDialog === "new") {
        await createPosition(details);
        toast.success("Position added");
      } else {
        await updatePosition(positionDialog.id, details);
        toast.success("Position saved");
      }
      setPositionDialog(null);
      revalidator.revalidate();
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  const removePosition = async (position) => {
    const { isConfirmed } = await Swal.fire({
      title: `Delete "${position.title}"?`,
      text: "Only a position that nobody has ever held can be deleted.",
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
    if (!isConfirmed) return;
    setError("");
    try {
      await deletePosition(position.id);
      toast.success("Position deleted");
      revalidator.revalidate();
    } catch (err) {
      setError(errorMessage(err));
    }
  };

  const openAppoint = (position) => {
    setError("");
    setAppointForm({ member: "", start_date: "", end_date: "", give_admin: false });
    setAppointDialog(position);
  };

  const saveAppoint = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    // Dates left empty: the term starts today and lasts two years
    const details = { position: appointDialog.id, member: Number(appointForm.member), give_admin: appointForm.give_admin };
    if (appointForm.start_date) details.start_date = appointForm.start_date;
    if (appointForm.end_date) details.end_date = appointForm.end_date;
    try {
      const saved = await createAssignment(details);
      toast.success(saved.admin_given ? `${saved.member_name} appointed and made an admin` : `${saved.member_name} appointed`);
      setAppointDialog(null);
      revalidator.revalidate();
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  const endTerm = async (position, holder) => {
    const isAdminNow = membersById[holder.member]?.role === "admin";
    const day = (offset) => {
      const d = new Date();
      d.setDate(d.getDate() + offset);
      return d.toLocaleDateString("en-CA"); // YYYY-MM-DD
    };
    // A term still counts on its last day, so "ended" means the last day was yesterday.
    // A term that only started today has no earlier day to end on: it is simply taken back.
    const startedToday = holder.start_date >= day(0);
    const result = await Swal.fire({
      title: `End ${holder.name}'s term as ${position.title}?`,
      text: startedToday
        ? "This term only started today, so ending it removes it."
        : "They stop being listed as serving. The term stays in the church's history.",
      icon: "warning",
      iconColor: "#ffc700",
      // Offered only to someone who is an admin, because an appointment may have given them that
      ...(isAdminNow ? { input: "checkbox", inputValue: 0, inputPlaceholder: "Also take away admin access" } : {}),
      showCancelButton: true,
      confirmButtonText: "Yes, end the term",
      cancelButtonText: "Keep serving",
      confirmButtonColor: "#b04a2a",
      cancelButtonColor: "#6b7280",
      reverseButtons: true,
      focusCancel: true,
    });
    if (!result.isConfirmed) return;
    setError("");
    try {
      if (startedToday) {
        if (result.value) await updateAssignment(holder.assignment, { remove_admin: true });
        await deleteAssignment(holder.assignment);
      } else {
        await updateAssignment(holder.assignment, { end_date: day(-1), remove_admin: Boolean(result.value) });
      }
      toast.success("Term ended");
      revalidator.revalidate();
    } catch (err) {
      setError(errorMessage(err));
    }
  };

  const removeEntry = async (position, holder) => {
    const { isConfirmed } = await Swal.fire({
      title: `Remove this entry for ${holder.name}?`,
      text: "Use this for a mistake. To finish a normal term, use End term so the history is kept.",
      icon: "warning",
      iconColor: "#ffc700",
      showCancelButton: true,
      confirmButtonText: "Yes, remove",
      cancelButtonText: "Keep it",
      confirmButtonColor: "#b04a2a",
      cancelButtonColor: "#6b7280",
      reverseButtons: true,
      focusCancel: true,
    });
    if (!isConfirmed) return;
    setError("");
    try {
      await deleteAssignment(holder.assignment);
      toast.success("Entry removed");
      revalidator.revalidate();
    } catch (err) {
      setError(errorMessage(err));
    }
  };

  // A box over the page closes on Escape and stops the page behind it from scrolling
  const dialogOpen = Boolean(positionDialog || appointDialog);
  useEffect(() => {
    if (!dialogOpen) return undefined;
    const onKey = (event) => {
      if (event.key !== "Escape") return;
      setPositionDialog(null);
      setAppointDialog(null);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [dialogOpen]);

  const selectedPerson = people.find((p) => String(p.id) === String(appointForm.member));

  return (
    <div>
      <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold sm:text-4xl">Leadership</h1>
          <p className="mt-1.5 max-w-2xl text-muted">
            The positions the church elects every two years. Everyone signed in sees who is serving on the Our leaders
            page.
          </p>
        </div>
        <button
          type="button"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-forest-900 px-4 py-2.5 text-sm font-semibold text-paper shadow-card transition hover:bg-forest-800 active:translate-y-px"
          onClick={() => openPosition("new")}
        >
          <Plus className="size-4" />
          New position
        </button>
      </header>

      {error && !dialogOpen && (
        <p role="alert" className="mb-4 flex items-start gap-2 rounded-3xl bg-clay-100 px-3.5 py-2.5 text-sm text-clay-700">
          <CircleAlert className="mt-0.5 size-4 shrink-0" />
          {error}
        </p>
      )}

      {endingSoon.length > 0 && (
        <div className="mb-6 rounded-3xl bg-marigold-100 px-5 py-4 text-sm text-ink">
          <p className="flex items-center gap-2 font-semibold">
            <Clock className="size-4" />
            Terms ending in the next three months
          </p>
          <ul className="mt-2 space-y-1">
            {endingSoon.map((h) => (
              <li key={h.assignment}>
                {h.position}: {h.name}, until {formatDate(h.term_end)}
              </li>
            ))}
          </ul>
        </div>
      )}

      {positions.length === 0 ? (
        <div className="rounded-3xl border border-line bg-white p-6 shadow-card">
          <div className="flex flex-col items-center px-6 py-10 text-center">
            <span className="grid size-12 place-items-center rounded-full bg-forest-50 text-forest-900">
              <BadgeCheck className="size-6" />
            </span>
            <h2 className="mt-3 text-xl font-semibold">No positions yet</h2>
            <p className="mt-1 max-w-sm text-sm text-muted">
              Add the titles the church uses, such as Elder, Deacon, Treasurer or Youth Leader, then appoint people to
              them.
            </p>
          </div>
        </div>
      ) : (
        <ul className="grid gap-5 lg:grid-cols-2">
          {positions.map((position) => (
            <li key={position.id} className="rounded-3xl border border-line bg-white p-5 shadow-card">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-lg font-semibold">{position.title}</h2>
                  {position.ministry_title && (
                    <span className="inline-flex items-center rounded-full bg-marigold-100 px-2.5 py-0.5 text-xs font-semibold text-marigold-600">
                      {position.ministry_title}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    aria-label={`Edit ${position.title}`}
                    className="rounded-full p-2 text-muted hover:bg-paper-deep hover:text-ink"
                    onClick={() => openPosition(position)}
                  >
                    <Pencil className="size-4" />
                  </button>
                  <button
                    type="button"
                    aria-label={`Delete ${position.title}`}
                    className="rounded-full p-2 text-muted hover:bg-clay-100 hover:text-clay-700"
                    onClick={() => removePosition(position)}
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>

              {position.holders.length === 0 ? (
                <p className="mt-3 text-sm text-muted">Nobody is serving in this position right now.</p>
              ) : (
                <ul className="mt-3 divide-y divide-line">
                  {position.holders.map((holder) => (
                    <li key={holder.assignment} className="flex flex-wrap items-center justify-between gap-2 py-2.5">
                      <div className="min-w-0">
                        <p className="truncate font-medium">{holder.name}</p>
                        <p className={`text-xs ${holder.ends_soon ? "font-semibold text-clay-600" : "text-muted"}`}>
                          Until {formatDate(holder.term_end)}
                          {holder.ends_soon && ` (${holder.ends_in_days} days left)`}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 text-sm">
                        <button
                          type="button"
                          className="rounded-full px-3 py-1 font-medium text-forest-800 hover:bg-forest-50"
                          onClick={() => endTerm(position, holder)}
                        >
                          End term
                        </button>
                        <button
                          type="button"
                          aria-label={`Remove entry for ${holder.name}`}
                          className="rounded-full p-1.5 text-muted hover:bg-clay-100 hover:text-clay-700"
                          onClick={() => removeEntry(position, holder)}
                        >
                          <X className="size-4" />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}

              <button
                type="button"
                className="mt-3 inline-flex items-center justify-center gap-2 rounded-full border border-line bg-white px-3 py-1.5 text-sm font-semibold text-ink transition hover:border-forest-600 hover:text-forest-800 active:translate-y-px"
                onClick={() => openAppoint(position)}
              >
                <UserPlus className="size-4" />
                Appoint someone
              </button>
            </li>
          ))}
        </ul>
      )}

      {positionDialog && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6">
          <div
            className="absolute inset-0 bg-forest-950/50 backdrop-blur-[2px]"
            onClick={() => setPositionDialog(null)}
            aria-hidden="true"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label={positionDialog === "new" ? "New position" : `Edit ${positionDialog.title}`}
            className="rise relative flex max-h-[92vh] w-full flex-col rounded-t-3xl bg-white shadow-lift outline-none sm:max-w-md sm:rounded-3xl"
          >
            <header className="flex items-start justify-between gap-4 border-b border-line px-5 py-4 sm:px-6">
              <h2 className="text-xl font-semibold">{positionDialog === "new" ? "New position" : "Edit position"}</h2>
              <button
                type="button"
                onClick={() => setPositionDialog(null)}
                aria-label="Close"
                className="rounded-full p-1.5 text-muted hover:bg-paper-deep hover:text-ink"
              >
                <X className="size-5" />
              </button>
            </header>
            <form onSubmit={savePosition} className="space-y-4 overflow-y-auto px-5 py-5 sm:px-6">
              {error && (
                <p role="alert" className="flex items-start gap-2 rounded-3xl bg-clay-100 px-3.5 py-2.5 text-sm text-clay-700">
                  <CircleAlert className="mt-0.5 size-4 shrink-0" />
                  {error}
                </p>
              )}
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium">
                  Title <span className="text-clay-600">*</span>
                </span>
                <input
                  className="input"
                  required
                  name="title"
                  maxLength={120}
                  placeholder="e.g. Elder, Treasurer, Youth Leader"
                  value={positionForm.title}
                  onChange={changePosition}
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium">Ministry (optional)</span>
                <select className="input" name="ministry" value={positionForm.ministry} onChange={changePosition}>
                  <option value="">Not tied to a ministry</option>
                  {ministries.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.title}
                    </option>
                  ))}
                </select>
                <span className="mt-1 block text-xs text-muted">
                  A position tied to a ministry also shows on that ministry&apos;s page.
                </span>
              </label>
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  className="rounded-full border border-line bg-white px-4 py-2.5 text-sm font-semibold text-ink hover:border-forest-600"
                  onClick={() => setPositionDialog(null)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={busy}
                  className="rounded-full bg-forest-900 px-4 py-2.5 text-sm font-semibold text-paper shadow-card hover:bg-forest-800 disabled:opacity-60"
                >
                  {busy ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {appointDialog && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6">
          <div
            className="absolute inset-0 bg-forest-950/50 backdrop-blur-[2px]"
            onClick={() => setAppointDialog(null)}
            aria-hidden="true"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`Appoint someone as ${appointDialog.title}`}
            className="rise relative flex max-h-[92vh] w-full flex-col rounded-t-3xl bg-white shadow-lift outline-none sm:max-w-md sm:rounded-3xl"
          >
            <header className="flex items-start justify-between gap-4 border-b border-line px-5 py-4 sm:px-6">
              <h2 className="text-xl font-semibold">{`Appoint a ${appointDialog.title}`}</h2>
              <button
                type="button"
                onClick={() => setAppointDialog(null)}
                aria-label="Close"
                className="rounded-full p-1.5 text-muted hover:bg-paper-deep hover:text-ink"
              >
                <X className="size-5" />
              </button>
            </header>
            <form onSubmit={saveAppoint} className="space-y-4 overflow-y-auto px-5 py-5 sm:px-6">
              {error && (
                <p role="alert" className="flex items-start gap-2 rounded-3xl bg-clay-100 px-3.5 py-2.5 text-sm text-clay-700">
                  <CircleAlert className="mt-0.5 size-4 shrink-0" />
                  {error}
                </p>
              )}
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium">
                  Member <span className="text-clay-600">*</span>
                </span>
                <select className="input" required name="member" value={appointForm.member} onChange={changeAppoint}>
                  <option value="">Choose a member</option>
                  {people.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium">Starts</span>
                  <input className="input" type="date" name="start_date" value={appointForm.start_date} onChange={changeAppoint} />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium">Ends</span>
                  <input className="input" type="date" name="end_date" value={appointForm.end_date} onChange={changeAppoint} />
                </label>
              </div>
              <p className="-mt-2 text-xs text-muted">Leave both empty: the term starts today and lasts two years.</p>
              <label className="flex items-start gap-2.5 rounded-3xl bg-paper px-4 py-3 text-sm">
                <input
                  type="checkbox"
                  name="give_admin"
                  className="mt-0.5 size-4 accent-forest-900"
                  checked={appointForm.give_admin}
                  disabled={selectedPerson?.role === "admin"}
                  onChange={changeAppoint}
                />
                <span>
                  Also give admin access
                  <span className="block text-xs text-muted">
                    {selectedPerson?.role === "admin"
                      ? "This person is already an admin."
                      : "Admins can see the member register and the Get involved requests. When the term ends you can take it away."}
                  </span>
                </span>
              </label>
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  className="rounded-full border border-line bg-white px-4 py-2.5 text-sm font-semibold text-ink hover:border-forest-600"
                  onClick={() => setAppointDialog(null)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={busy}
                  className="rounded-full bg-forest-900 px-4 py-2.5 text-sm font-semibold text-paper shadow-card hover:bg-forest-800 disabled:opacity-60"
                >
                  {busy ? "Saving..." : "Appoint"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

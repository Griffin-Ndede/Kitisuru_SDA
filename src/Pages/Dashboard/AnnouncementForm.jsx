import React, { useState } from "react";
import { createAnnouncement, updateAnnouncement } from "../../Api";
import { errorMessage } from "../../Api/client";
import { useToast } from "../../Context/ToastContext";
import { LoaderCircle, CircleAlert } from "lucide-react";

// Post an announcement, or change one. `announcement` is null when posting.
// `ministries` lets the admin choose a ministry; `ministry` (an id) fixes it, as on a ministry's own page.
export default function AnnouncementForm({ announcement, ministries, ministry = null, onSaved, onClose }) {
  const toast = useToast();
  const [form, setForm] = useState({
    title: announcement?.title || "",
    body: announcement?.body || "",
    pinned: announcement?.pinned || false,
    expires_on: announcement?.expires_on || "",
    ministry: announcement ? announcement.ministry || "" : ministry || "",
  });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const details = {
        ...form,
        expires_on: form.expires_on || null,
        ministry: form.ministry ? Number(form.ministry) : null,
      };
      await (announcement ? updateAnnouncement(announcement.id, details) : createAnnouncement(details));
      toast.success(announcement ? "Announcement saved" : "Announcement posted");
      onSaved();
    } catch (err) {
      setError(errorMessage(err));
      setBusy(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium">
            Title <span className="text-clay-600">*</span>
          </span>
          <input className="input" required name="title" value={form.title} onChange={change} />
        </label>
      </div>
      <div>
        <label htmlFor="body" className="mb-1.5 block text-sm font-medium">
          Message <span className="text-clay-600">*</span>
        </label>
        <textarea id="body" name="body" className="input min-h-32" value={form.body} onChange={change} required />
      </div>
      {ministries && (
        <div>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium">For</span>
            <select className="input" name="ministry" value={form.ministry} onChange={change}>
              <option value="">The whole church</option>
              {ministries.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.title}
                </option>
              ))}
            </select>
          </label>
          <p className="mt-1.5 text-xs text-muted">A ministry&apos;s announcements also show on that ministry&apos;s page.</p>
        </div>
      )}
      <div>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium">Show until</span>
          <input className="input" type="date" name="expires_on" value={form.expires_on} onChange={change} />
        </label>
        <p className="mt-1.5 text-xs text-muted">Optional. Members stop seeing it after this day.</p>
      </div>
      <label className="flex items-start gap-3 text-sm">
        <input
          type="checkbox"
          checked={Boolean(form.pinned)}
          onChange={(e) => setForm({ ...form, pinned: e.target.checked })}
          className="mt-0.5 size-4 rounded accent-forest-700"
        />
        <span>
          <span className="font-medium">Pin to the top</span>
          <span className="block text-xs text-muted">Pinned announcements stay above the rest.</span>
        </span>
      </label>
      {error && (
        <p role="alert" className="flex items-start gap-2 rounded-xl bg-clay-100 px-3.5 py-2.5 text-sm text-clay-700">
          <CircleAlert className="mt-0.5 size-4 shrink-0" />
          {error}
        </p>
      )}
      <div className="flex gap-3">
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 rounded-full font-semibold transition active:translate-y-px disabled:opacity-60 bg-forest-900 text-paper hover:bg-forest-800 shadow-card px-4 py-2.5 text-sm"
          disabled={busy}
        >
          {busy && <LoaderCircle className="size-4 animate-spin" />}
          {announcement ? "Save changes" : "Post"}
        </button>
        <button
          type="button"
          className="inline-flex items-center justify-center gap-2 rounded-full font-semibold transition active:translate-y-px disabled:opacity-60 border border-line bg-white text-ink hover:border-forest-600 hover:text-forest-800 px-4 py-2.5 text-sm"
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

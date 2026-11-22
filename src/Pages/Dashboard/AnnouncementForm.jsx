import React, { useState } from "react";
import { createAnnouncement, updateAnnouncement } from "../../Api";
import { errorMessage } from "../../Api/client";
import Button from "../../Components/ui/Button";
import { Checkbox, Input } from "../../Components/ui/Fields";
import { FormError } from "../../Components/ui/States";
import { useToast } from "../../Context/ToastContext";

// Post an announcement, or change one. `announcement` is null when posting.
export default function AnnouncementForm({ announcement, onSaved, onClose }) {
  const toast = useToast();
  const [form, setForm] = useState({
    title: announcement?.title || "",
    body: announcement?.body || "",
    pinned: announcement?.pinned || false,
    expires_on: announcement?.expires_on || "",
  });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const details = { ...form, expires_on: form.expires_on || null };
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
      <Input label="Title" name="title" value={form.title} onChange={change} required />
      <div>
        <label htmlFor="body" className="mb-1.5 block text-sm font-medium">Message <span className="text-clay-600">*</span></label>
        <textarea id="body" name="body" className="input min-h-32" value={form.body} onChange={change} required />
      </div>
      <Input label="Show until" type="date" name="expires_on" value={form.expires_on} onChange={change}
        hint="Optional. Members stop seeing it after this day." />
      <Checkbox label="Pin to the top" hint="Pinned announcements stay above the rest."
        checked={form.pinned} onChange={(e) => setForm({ ...form, pinned: e.target.checked })} />
      <FormError>{error}</FormError>
      <div className="flex gap-3">
        <Button type="submit" loading={busy}>{announcement ? "Save changes" : "Post"}</Button>
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
      </div>
    </form>
  );
}

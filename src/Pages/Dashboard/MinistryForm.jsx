import React, { useState } from "react";
import { createMinistry, updateMinistry } from "../../Api";
import { errorMessage } from "../../Api/client";
import { useToast } from "../../Context/ToastContext";
import { LoaderCircle, CircleAlert } from "lucide-react";

// Add a ministry, or change its name and wording. `ministry` is null when adding.
// Photos, programs, contact people and events are added in the Django admin.
export default function MinistryForm({ ministry, onSaved, onClose }) {
  const toast = useToast();
  const [form, setForm] = useState({
    title: ministry?.title || "",
    mission: ministry?.mission || "",
    description: ministry?.description || "",
  });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const saved = ministry ? await updateMinistry(ministry.id, form) : await createMinistry(form);
      toast.success(ministry ? "Ministry saved" : `${saved.title} added`);
      onSaved(saved);
    } catch (err) {
      setError(errorMessage(err));
      setBusy(false);
    }
  };

  const area = "input min-h-24";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium">
            Name <span className="text-clay-600">*</span>
          </span>
          <input className="input" required name="title" value={form.title} onChange={change} />
        </label>
      </div>
      <div>
        <label htmlFor="mission" className="mb-1.5 block text-sm font-medium">
          Mission
        </label>
        <textarea id="mission" name="mission" className={area} value={form.mission} onChange={change} />
      </div>
      <div>
        <label htmlFor="description" className="mb-1.5 block text-sm font-medium">
          About the ministry
        </label>
        <textarea id="description" name="description" className={area} value={form.description} onChange={change} />
      </div>
      {error && (
        <p role="alert" className="flex items-start gap-2 rounded-3xl bg-clay-100 px-3.5 py-2.5 text-sm text-clay-700">
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
          {ministry ? "Save changes" : "Add ministry"}
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

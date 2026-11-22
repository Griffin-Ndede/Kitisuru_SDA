import React, { useState } from "react";
import { createMinistry, updateMinistry } from "../../Api";
import { errorMessage } from "../../Api/client";
import Button from "../../Components/ui/Button";
import { Input } from "../../Components/ui/Fields";
import { FormError } from "../../Components/ui/States";
import { useToast } from "../../Context/ToastContext";

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
      <Input label="Name" name="title" value={form.title} onChange={change} placeholder="e.g. Youth, Children, Women" required />
      <div>
        <label htmlFor="mission" className="mb-1.5 block text-sm font-medium">Mission</label>
        <textarea id="mission" name="mission" className={area} value={form.mission} onChange={change} />
      </div>
      <div>
        <label htmlFor="description" className="mb-1.5 block text-sm font-medium">About the ministry</label>
        <textarea id="description" name="description" className={area} value={form.description} onChange={change} />
      </div>
      <FormError>{error}</FormError>
      <div className="flex gap-3">
        <Button type="submit" loading={busy}>{ministry ? "Save changes" : "Add ministry"}</Button>
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
      </div>
    </form>
  );
}

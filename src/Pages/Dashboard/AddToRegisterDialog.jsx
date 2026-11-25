import React, { useState } from "react";
import { addRequestToRegister } from "../../Api";
import { errorMessage } from "../../Api/client";
import { useToast } from "../../Context/ToastContext";
import { kindLabels } from "./memberHelpers";
import { LoaderCircle, CircleAlert } from "lucide-react";

// Choose the ministries and clusters for a person who sent a Get involved form,
// then add them to the member register. The ministries they asked for are ticked.
export default function AddToRegisterDialog({ request, ministries, clusters, onSaved, onClose }) {
  const toast = useToast();
  const [chosen, setChosen] = useState({
    ministries: request.ministries.map((m) => m.id),
    clusters: [],
  });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const toggle = (field, id) =>
    setChosen({
      ...chosen,
      [field]: chosen[field].includes(id) ? chosen[field].filter((x) => x !== id) : [...chosen[field], id],
    });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const result = await addRequestToRegister(request.id, chosen);
      toast.success(
        result.already_in_register
          ? `${request.name} is already in the register. Added to the groups`
          : `${request.name} added to the register`,
      );
      onSaved();
    } catch (err) {
      setError(errorMessage(err));
      setBusy(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 text-sm">
      <p className="text-muted">
        {request.name} will be added to the church register (or found there, if they are already in it by email or
        phone). They can sign in later by registering with the same email.
      </p>

      <fieldset>
        <legend className="mb-2 font-medium">Ministries</legend>
        {ministries.length === 0 ? (
          <p className="text-muted">No ministries yet.</p>
        ) : (
          <div className="grid gap-2 sm:grid-cols-2">
            {ministries.map((m) => (
              <label key={m.id} className="flex items-start gap-3 text-sm">
                <input
                  type="checkbox"
                  checked={Boolean(chosen.ministries.includes(m.id))}
                  onChange={() => toggle("ministries", m.id)}
                  className="mt-0.5 size-4 rounded accent-forest-700"
                />
                <span>
                  <span className="font-medium">{m.title}</span>
                </span>
              </label>
            ))}
          </div>
        )}
      </fieldset>

      <fieldset>
        <legend className="mb-1 font-medium">Clusters</legend>
        {request.area && (
          <p className="mb-2 text-muted">
            They said they live in <strong className="text-ink">{request.area}</strong>.
          </p>
        )}
        {clusters.length === 0 ? (
          <p className="text-muted">No clusters yet. Create them on the Clusters page.</p>
        ) : (
          <div className="grid gap-2 sm:grid-cols-2">
            {clusters.map((c) => (
              <label key={c.id} className="flex items-start gap-3 text-sm">
                <input
                  type="checkbox"
                  checked={Boolean(chosen.clusters.includes(c.id))}
                  onChange={() => toggle("clusters", c.id)}
                  className="mt-0.5 size-4 rounded accent-forest-700"
                />
                <span>
                  <span className="font-medium">{c.name}</span>
                  <span className="block text-xs text-muted">{kindLabels[c.kind]}</span>
                </span>
              </label>
            ))}
          </div>
        )}
      </fieldset>

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
          Add to the register
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

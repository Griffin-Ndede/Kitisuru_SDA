import React, { useState } from "react";
import { addRequestToRegister } from "../../Api";
import { errorMessage } from "../../Api/client";
import Button from "../../Components/ui/Button";
import { Checkbox } from "../../Components/ui/Fields";
import { FormError } from "../../Components/ui/States";
import { useToast } from "../../Context/ToastContext";
import { kindLabels } from "./memberHelpers";

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
          : `${request.name} added to the register`
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
        {ministries.length === 0 ? <p className="text-muted">No ministries yet.</p> : (
          <div className="grid gap-2 sm:grid-cols-2">
            {ministries.map((m) => (
              <Checkbox key={m.id} label={m.title} checked={chosen.ministries.includes(m.id)} onChange={() => toggle("ministries", m.id)} />
            ))}
          </div>
        )}
      </fieldset>

      <fieldset>
        <legend className="mb-1 font-medium">Clusters</legend>
        {request.area && <p className="mb-2 text-muted">They said they live in <strong className="text-ink">{request.area}</strong>.</p>}
        {clusters.length === 0 ? <p className="text-muted">No clusters yet. Create them on the Clusters page.</p> : (
          <div className="grid gap-2 sm:grid-cols-2">
            {clusters.map((c) => (
              <Checkbox key={c.id} label={c.name} hint={kindLabels[c.kind]} checked={chosen.clusters.includes(c.id)} onChange={() => toggle("clusters", c.id)} />
            ))}
          </div>
        )}
      </fieldset>

      <FormError>{error}</FormError>
      <div className="flex gap-3">
        <Button type="submit" loading={busy}>Add to the register</Button>
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
      </div>
    </form>
  );
}

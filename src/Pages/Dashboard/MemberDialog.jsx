import React, { useState } from "react";
import { addMember, deleteMember, resendInvitation, updateMember, updateUser } from "../../Api";
import { errorMessage } from "../../Api/client";
import { Check, KeyRound, Power, Trash2 } from "lucide-react";
import Button from "../../Components/ui/Button";
import Badge from "../../Components/ui/Badge";
import { Input, Select, Checkbox } from "../../Components/ui/Fields";
import { FormError } from "../../Components/ui/States";
import { useToast } from "../../Context/ToastContext";
import CopyLink from "./CopyLink";
import { kindLabels, statusLabels, statusOf } from "./memberHelpers";
import { roleLabels } from "./roles";

const blank = {
  first_name: "", last_name: "", email: "", phone: "", gender: "",
  date_of_birth: "", address: "", clusters: [], ministries: [],
};

// Add a member, or edit one: their details, their clusters, and their account.
// `member` is null when adding.
export default function MemberDialog({ member, clusters, ministries = [], me, onSaved, onClose }) {
  const [form, setForm] = useState(
    member
      ? {
          first_name: member.first_name, last_name: member.last_name, email: member.email,
          phone: member.phone, gender: member.gender, date_of_birth: member.date_of_birth || "",
          address: member.address, clusters: member.clusters, ministries: member.ministries,
        }
      : blank
  );
  const [error, setError] = useState("");
  const toast = useToast();
  const [invite, setInvite] = useState(null);
  const [busy, setBusy] = useState(false);

  const isMe = member?.id === me.id;
  const canEditEmail = !member || member.record_only;
  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const toggle = (field, id) =>
    setForm({
      ...form,
      [field]: form[field].includes(id) ? form[field].filter((x) => x !== id) : [...form[field], id],
    });

  const run = async (action, success) => {
    setError("");
    setBusy(true);
    try {
      const result = await action();
      toast.success(success);
      return result ?? true;
    } catch (err) {
      setError(errorMessage(err));
      return null;
    } finally {
      setBusy(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const details = { ...form, date_of_birth: form.date_of_birth || null };
    if (!canEditEmail) delete details.email;
    const saved = await run(
      () => (member ? updateMember(member.id, details) : addMember(details)),
      "Saved"
    );
    if (saved) {
      onSaved();
      if (!member) onClose();
    }
  };

  const account = (changes, success) =>
    run(() => updateUser(member.id, changes), success).then((ok) => ok && onSaved());

  const status = member ? statusOf(member) : null;
  const statusTone = { active: "green", waiting: "gold", record: "grey", off: "clay" };

  return (
    <div className="space-y-6 text-sm">
      <form onSubmit={handleSave} className="grid gap-4 sm:grid-cols-2">
        <Input label="First name" name="first_name" value={form.first_name} onChange={change} required />
        <Input label="Last name" name="last_name" value={form.last_name} onChange={change} />
        <Input label={`Email${canEditEmail ? "" : " (their sign-in name)"}`} type="email" name="email"
          value={form.email} onChange={change} readOnly={!canEditEmail} disabled={!canEditEmail} />
        <Input label="Phone" type="tel" name="phone" value={form.phone} onChange={change} />
        <Select label="Gender" name="gender" value={form.gender} onChange={change} placeholder="—"
          options={[{ value: "male", label: "Male" }, { value: "female", label: "Female" }]} />
        <Input label="Date of birth" type="date" name="date_of_birth" value={form.date_of_birth} onChange={change} />
        <Input className="sm:col-span-2" label="Address" name="address" value={form.address} onChange={change} />

        <fieldset className="sm:col-span-2">
          <legend className="mb-2 text-sm font-medium">Ministries</legend>
          {ministries.length === 0 ? (
            <p className="text-muted">No ministries yet. Add them on the Ministries page.</p>
          ) : (
            <div className="grid gap-2 sm:grid-cols-2">
              {ministries.map((m) => (
                <Checkbox key={m.id} label={m.title}
                  checked={form.ministries.includes(m.id)} onChange={() => toggle("ministries", m.id)} />
              ))}
            </div>
          )}
        </fieldset>

        <fieldset className="sm:col-span-2">
          <legend className="mb-2 text-sm font-medium">Clusters</legend>
          {clusters.length === 0 ? (
            <p className="text-muted">No clusters yet. Create them on the Clusters page.</p>
          ) : (
            <div className="grid gap-2 sm:grid-cols-2">
              {clusters.map((c) => (
                <Checkbox key={c.id} label={c.name} hint={kindLabels[c.kind]}
                  checked={form.clusters.includes(c.id)} onChange={() => toggle("clusters", c.id)} />
              ))}
            </div>
          )}
        </fieldset>

        <div className="flex flex-wrap items-center gap-3 sm:col-span-2">
          <Button type="submit" loading={busy}>{member ? "Save changes" : "Add member"}</Button>
          <Button variant="secondary" onClick={onClose}>Close</Button>
        </div>
        <div className="sm:col-span-2 empty:hidden"><FormError>{error}</FormError></div>
      </form>

      {member && (
        <section className="space-y-4 border-t border-line pt-5">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-semibold">Account</h3>
            <Badge tone={statusTone[status]}>{statusLabels[status]}</Badge>
          </div>
          {!member.record_only && (
            <Select label="Role" value={member.role} disabled={busy || isMe} className="max-w-xs"
              onChange={(e) => account({ role: e.target.value }, "Role changed")}
              options={Object.entries(roleLabels).map(([value, label]) => ({ value, label }))} />
          )}
          <div className="flex flex-wrap gap-2">
            {status === "waiting" && (
              <Button size="sm" icon={Check} disabled={busy} onClick={() => account({ approved: true }, "Approved")}>Approve</Button>
            )}
            {!isMe && (
              <Button size="sm" variant="secondary" icon={Power} disabled={busy}
                onClick={() => account({ is_active: !member.is_active }, member.is_active ? "Account switched off" : "Account switched on")}>
                {member.is_active ? "Switch off" : "Switch on"}
              </Button>
            )}
            {member.is_active && !isMe && member.email && (
              <Button size="sm" variant="secondary" icon={KeyRound} disabled={busy}
                onClick={async () => setInvite(await run(() => resendInvitation(member.id), "Link ready below"))}>
                New invitation link
              </Button>
            )}
            {member.record_only && (
              <Button size="sm" variant="danger" icon={Trash2} disabled={busy}
                onClick={async () => {
                  if (window.confirm(`Delete ${member.first_name} from the register?`)) {
                    if (await run(() => deleteMember(member.id), "Deleted")) {
                      onSaved();
                      onClose();
                    }
                  }
                }}>
                Delete from the register
              </Button>
            )}
          </div>
          {member.record_only && !member.email && (
            <p className="text-muted">Add an email address above if you want to invite this person to sign in.</p>
          )}
          {invite?.invite_link && (
            <div className="rounded-xl bg-forest-50 p-4">
              <p className="mb-2">Send this link to {member.first_name} yourself. It works for them only and for 7 days:</p>
              <CopyLink link={invite.invite_link} />
            </div>
          )}
        </section>
      )}
    </div>
  );
}

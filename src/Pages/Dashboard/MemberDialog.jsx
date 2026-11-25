import React, { useState } from "react";
import { addMember, deleteMember, resendInvitation, updateMember, updateUser } from "../../Api";
import { errorMessage } from "../../Api/client";
import { Check, KeyRound, Power, Trash2, LoaderCircle, CircleAlert } from "lucide-react";
import Swal from "sweetalert2";
import { useToast } from "../../Context/ToastContext";
import CopyLink from "./CopyLink";
import { kindLabels, statusLabels, statusOf } from "./memberHelpers";
import { roleLabels } from "./roles";

const blank = {
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  gender: "",
  date_of_birth: "",
  address: "",
  clusters: [],
  ministries: [],
};

// Add a member, or edit one: their details, their clusters, and their account.
// `member` is null when adding.
export default function MemberDialog({ member, clusters, ministries = [], me, onSaved, onClose }) {
  const [form, setForm] = useState(
    member
      ? {
          first_name: member.first_name,
          last_name: member.last_name,
          email: member.email,
          phone: member.phone,
          gender: member.gender,
          date_of_birth: member.date_of_birth || "",
          address: member.address,
          clusters: member.clusters,
          ministries: member.ministries,
        }
      : blank,
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

  const handleDelete = async () => {
    const { isConfirmed } = await Swal.fire({
      title: `Delete ${member.first_name} from the register?`,
      text: "This removes their entry. It cannot be undone.",
      icon: "warning",
      iconColor: "#ffc700", // the website's yellow
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
      cancelButtonText: "Keep them",
      confirmButtonColor: "#b04a2a", // red: this removes something
      cancelButtonColor: "#6b7280", // grey
      reverseButtons: true,
      focusCancel: true,
    });
    if (isConfirmed && (await run(() => deleteMember(member.id), "Deleted"))) {
      onSaved();
      onClose();
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const details = { ...form, date_of_birth: form.date_of_birth || null };
    if (!canEditEmail) delete details.email;
    const saved = await run(() => (member ? updateMember(member.id, details) : addMember(details)), "Saved");
    if (saved) {
      onSaved();
      if (!member) onClose();
    }
  };

  const account = (changes, success) =>
    run(() => updateUser(member.id, changes), success).then((ok) => ok && onSaved());

  const status = member ? statusOf(member) : null;
  const statusTone = {
    active: "bg-forest-100 text-forest-800",
    waiting: "bg-marigold-100 text-marigold-600",
    record: "bg-paper-deep text-muted",
    off: "bg-clay-100 text-clay-700",
  };

  return (
    <div className="space-y-6 text-sm">
      <form onSubmit={handleSave} className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium">
              First name <span className="text-clay-600">*</span>
            </span>
            <input className="input" required name="first_name" value={form.first_name} onChange={change} />
          </label>
        </div>
        <div>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium">Last name</span>
            <input className="input" name="last_name" value={form.last_name} onChange={change} />
          </label>
        </div>
        <div>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium">{`Email${canEditEmail ? "" : " (their sign-in name)"}`}</span>
            <input
              className="input"
              type="email"
              name="email"
              value={form.email}
              onChange={change}
              readOnly={!canEditEmail}
              disabled={!canEditEmail}
            />
          </label>
        </div>
        <div>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium">Phone</span>
            <input className="input" type="tel" name="phone" value={form.phone} onChange={change} />
          </label>
        </div>
        <div>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium">Gender</span>
            <select className="input" name="gender" value={form.gender} onChange={change}>
              <option value="">—</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </label>
        </div>
        <div>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium">Date of birth</span>
            <input className="input" type="date" name="date_of_birth" value={form.date_of_birth} onChange={change} />
          </label>
        </div>
        <div className="sm:col-span-2">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium">Address</span>
            <input className="input" name="address" value={form.address} onChange={change} />
          </label>
        </div>

        <fieldset className="sm:col-span-2">
          <legend className="mb-2 text-sm font-medium">Ministries</legend>
          {ministries.length === 0 ? (
            <p className="text-muted">No ministries yet. Add them on the Ministries page.</p>
          ) : (
            <div className="grid gap-2 sm:grid-cols-2">
              {ministries.map((m) => (
                <label key={m.id} className="flex items-start gap-3 text-sm">
                  <input
                    type="checkbox"
                    checked={Boolean(form.ministries.includes(m.id))}
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

        <fieldset className="sm:col-span-2">
          <legend className="mb-2 text-sm font-medium">Clusters</legend>
          {clusters.length === 0 ? (
            <p className="text-muted">No clusters yet. Create them on the Clusters page.</p>
          ) : (
            <div className="grid gap-2 sm:grid-cols-2">
              {clusters.map((c) => (
                <label key={c.id} className="flex items-start gap-3 text-sm">
                  <input
                    type="checkbox"
                    checked={Boolean(form.clusters.includes(c.id))}
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

        <div className="flex flex-wrap items-center gap-3 sm:col-span-2">
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-full font-semibold transition active:translate-y-px disabled:opacity-60 bg-forest-900 text-paper hover:bg-forest-800 shadow-card px-4 py-2.5 text-sm"
            disabled={busy}
          >
            {busy && <LoaderCircle className="size-4 animate-spin" />}
            {member ? "Save changes" : "Add member"}
          </button>
          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 rounded-full font-semibold transition active:translate-y-px disabled:opacity-60 border border-line bg-white text-ink hover:border-forest-600 hover:text-forest-800 px-4 py-2.5 text-sm"
            onClick={onClose}
          >
            Close
          </button>
        </div>
        <div className="sm:col-span-2 empty:hidden">
          {error && (
            <p
              role="alert"
              className="flex items-start gap-2 rounded-xl bg-clay-100 px-3.5 py-2.5 text-sm text-clay-700"
            >
              <CircleAlert className="mt-0.5 size-4 shrink-0" />
              {error}
            </p>
          )}
        </div>
      </form>

      {member && (
        <section className="space-y-4 border-t border-line pt-5">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-semibold">Account</h3>
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusTone[status]}`}
            >
              {statusLabels[status]}
            </span>
          </div>
          {!member.record_only && (
            <div className="max-w-xs">
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium">Role</span>
                <select
                  className="input"
                  value={member.role}
                  disabled={busy || isMe}
                  onChange={(e) => account({ role: e.target.value }, "Role changed")}
                >
                  {Object.entries(roleLabels)
                    .map(([value, label]) => ({ value, label }))
                    .map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                </select>
              </label>
            </div>
          )}
          <div className="flex flex-wrap gap-2">
            {status === "waiting" && (
              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 rounded-full font-semibold transition active:translate-y-px disabled:opacity-60 bg-forest-900 text-paper hover:bg-forest-800 shadow-card px-3 py-1.5 text-sm"
                disabled={busy}
                onClick={() => account({ approved: true }, "Approved")}
              >
                <Check className="size-4" />
                Approve
              </button>
            )}
            {!isMe && (
              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 rounded-full font-semibold transition active:translate-y-px disabled:opacity-60 border border-line bg-white text-ink hover:border-forest-600 hover:text-forest-800 px-3 py-1.5 text-sm"
                disabled={busy}
                onClick={() =>
                  account(
                    { is_active: !member.is_active },
                    member.is_active ? "Account switched off" : "Account switched on",
                  )
                }
              >
                <Power className="size-4" />
                {member.is_active ? "Switch off" : "Switch on"}
              </button>
            )}
            {member.is_active && !isMe && member.email && (
              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 rounded-full font-semibold transition active:translate-y-px disabled:opacity-60 border border-line bg-white text-ink hover:border-forest-600 hover:text-forest-800 px-3 py-1.5 text-sm"
                disabled={busy}
                onClick={async () => setInvite(await run(() => resendInvitation(member.id), "Link ready below"))}
              >
                <KeyRound className="size-4" />
                New invitation link
              </button>
            )}
            {member.record_only && (
              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 rounded-full font-semibold transition active:translate-y-px disabled:opacity-60 bg-clay-600 text-white hover:bg-clay-700 px-3 py-1.5 text-sm"
                disabled={busy}
                onClick={handleDelete}
              >
                <Trash2 className="size-4" />
                Delete from the register
              </button>
            )}
          </div>
          {member.record_only && !member.email && (
            <p className="text-muted">Add an email address above if you want to invite this person to sign in.</p>
          )}
          {invite?.invite_link && (
            <div className="rounded-xl bg-forest-50 p-4">
              <p className="mb-2">
                Send this link to {member.first_name} yourself. It works for them only and for 7 days:
              </p>
              <CopyLink link={invite.invite_link} />
            </div>
          )}
        </section>
      )}
    </div>
  );
}

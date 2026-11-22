import React, { useState } from "react";
import { addMember, deleteMember, resendInvitation, updateMember, updateUser } from "../../Api";
import { errorMessage } from "../../Api/client";
import { inputClass } from "../../Components/AuthCard";
import CopyLink from "./CopyLink";
import { kindLabels, statusLabels, statusOf } from "./memberHelpers";
import { roleLabels } from "./roles";

const blank = {
  first_name: "", last_name: "", email: "", phone: "", gender: "",
  date_of_birth: "", address: "", clusters: [],
};

// Add a member, or edit one: their details, their clusters, and their account.
// `member` is null when adding.
export default function MemberDialog({ member, clusters, me, onSaved, onClose }) {
  const [form, setForm] = useState(
    member
      ? {
          first_name: member.first_name, last_name: member.last_name, email: member.email,
          phone: member.phone, gender: member.gender, date_of_birth: member.date_of_birth || "",
          address: member.address, clusters: member.clusters,
        }
      : blank
  );
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [invite, setInvite] = useState(null);
  const [busy, setBusy] = useState(false);

  const isMe = member?.id === me.id;
  const canEditEmail = !member || member.record_only;
  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const toggleCluster = (id) =>
    setForm({
      ...form,
      clusters: form.clusters.includes(id) ? form.clusters.filter((c) => c !== id) : [...form.clusters, id],
    });

  const run = async (action, success) => {
    setError("");
    setMessage("");
    setBusy(true);
    try {
      const result = await action();
      setMessage(success);
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
      "Saved."
    );
    if (saved) {
      onSaved();
      if (!member) onClose();
    }
  };

  const account = (changes, success) =>
    run(() => updateUser(member.id, changes), success).then((ok) => ok && onSaved());

  const label = "block text-xs font-medium text-gray-600 mb-1";
  const status = member ? statusOf(member) : null;

  return (
    <div className="space-y-6 text-sm">
      <form onSubmit={handleSave} className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className={label} htmlFor="m_first">First name</label>
          <input id="m_first" className={inputClass} name="first_name" value={form.first_name} onChange={change} required />
        </div>
        <div>
          <label className={label} htmlFor="m_last">Last name</label>
          <input id="m_last" className={inputClass} name="last_name" value={form.last_name} onChange={change} />
        </div>
        <div>
          <label className={label} htmlFor="m_email">Email {!canEditEmail && "(their sign-in name)"}</label>
          <input id="m_email" className={`${inputClass} ${canEditEmail ? "" : "bg-gray-100"}`} type="email" name="email"
            value={form.email} onChange={change} readOnly={!canEditEmail} />
        </div>
        <div>
          <label className={label} htmlFor="m_phone">Phone</label>
          <input id="m_phone" className={inputClass} type="tel" name="phone" value={form.phone} onChange={change} />
        </div>
        <div>
          <label className={label} htmlFor="m_gender">Gender</label>
          <select id="m_gender" className={inputClass} name="gender" value={form.gender} onChange={change}>
            <option value="">—</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
        <div>
          <label className={label} htmlFor="m_dob">Date of birth</label>
          <input id="m_dob" className={inputClass} type="date" name="date_of_birth" value={form.date_of_birth} onChange={change} />
        </div>
        <div className="sm:col-span-2">
          <label className={label} htmlFor="m_address">Address</label>
          <input id="m_address" className={inputClass} name="address" value={form.address} onChange={change} />
        </div>

        <fieldset className="sm:col-span-2">
          <legend className={label}>Clusters</legend>
          {clusters.length === 0 ? (
            <p className="text-gray-500">No clusters yet. Create them on the Clusters page.</p>
          ) : (
            <div className="flex flex-wrap gap-x-5 gap-y-2">
              {clusters.map((c) => (
                <label key={c.id} className="flex items-center gap-2">
                  <input type="checkbox" checked={form.clusters.includes(c.id)} onChange={() => toggleCluster(c.id)} />
                  {c.name} <span className="text-gray-400">({kindLabels[c.kind]})</span>
                </label>
              ))}
            </div>
          )}
        </fieldset>

        <div className="sm:col-span-2 flex flex-wrap items-center gap-3">
          <button type="submit" disabled={busy} className="px-6 py-2 rounded-full bg-custom-blue text-white font-semibold cursor-pointer disabled:opacity-60">
            {member ? "Save changes" : "Add member"}
          </button>
          <button type="button" onClick={onClose} className="px-5 py-2 rounded-full border border-gray-300 cursor-pointer">Close</button>
          {message && <span role="status" className="text-green-700">{message}</span>}
          {error && <span role="alert" className="text-red-600">{error}</span>}
        </div>
      </form>

      {member && (
        <section className="border-t border-gray-200 pt-4 space-y-3">
          <h3 className="font-bold">Account: {statusLabels[status]}</h3>
          {!member.record_only && (
            <div className="flex flex-wrap items-center gap-3">
              <label htmlFor="m_role">Role</label>
              <select id="m_role" value={member.role} disabled={busy || isMe} className="border border-gray-300 rounded px-2 py-1"
                onChange={(e) => account({ role: e.target.value }, "Role changed.")}>
                {Object.entries(roleLabels).map(([value, text]) => <option key={value} value={value}>{text}</option>)}
              </select>
            </div>
          )}
          <div className="flex flex-wrap gap-4">
            {status === "waiting" && (
              <button type="button" disabled={busy} onClick={() => account({ approved: true }, "Approved.")}
                className="px-4 py-1 rounded-full bg-custom-blue text-white cursor-pointer">Approve</button>
            )}
            {!isMe && (
              <button type="button" disabled={busy} className="text-custom-blue underline cursor-pointer"
                onClick={() => account({ is_active: !member.is_active }, member.is_active ? "Account switched off." : "Account switched on.")}>
                {member.is_active ? "Switch off" : "Switch on"}
              </button>
            )}
            {member.is_active && !isMe && member.email && (
              <button type="button" disabled={busy} className="text-custom-blue underline cursor-pointer"
                onClick={async () => setInvite(await run(() => resendInvitation(member.id), "Link ready below."))}>
                New invitation link
              </button>
            )}
            {member.record_only && (
              <button type="button" disabled={busy} className="text-red-600 underline cursor-pointer"
                onClick={async () => {
                  if (window.confirm(`Delete ${member.first_name} from the register?`)) {
                    if (await run(() => deleteMember(member.id), "Deleted.")) {
                      onSaved();
                      onClose();
                    }
                  }
                }}>
                Delete from the register
              </button>
            )}
          </div>
          {member.record_only && !member.email && (
            <p className="text-gray-500">Add an email address above if you want to invite this person to sign in.</p>
          )}
          {invite?.invite_link && (
            <div className="rounded-xl bg-blue-50 p-3">
              <p className="mb-2">Send this link to {member.first_name} yourself. It works for them only and for 7 days:</p>
              <CopyLink link={invite.invite_link} />
            </div>
          )}
        </section>
      )}
    </div>
  );
}

import React, { useState } from "react";
import { useLoaderData, useRevalidator, useRouteLoaderData } from "react-router";
import { inviteUser, resendInvitation, updateUser } from "../../Api";
import { errorMessage } from "../../Api/client";
import { inputClass } from "../../Components/AuthCard";
import { roleLabels } from "./roles";

const emptyForm = { email: "", first_name: "", last_name: "", role: "member" };

// Admin only: see everyone with an account, invite people, change roles.
export default function People() {
  const { people } = useLoaderData();
  const { user: me } = useRouteLoaderData("portal");
  const revalidator = useRevalidator();
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState("");
  // The link to send by hand (WhatsApp, for example) after inviting someone.
  const [invite, setInvite] = useState(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // Runs an action, shows its result next to the form, then reloads the list.
  const run = async (action, success) => {
    setError("");
    setMessage("");
    setInvite(null);
    setBusy(true);
    try {
      const result = await action();
      setMessage(success);
      if (result?.invite_link) {
        setInvite(result);
        setCopied(false);
      }
      revalidator.revalidate();
      return true;
    } catch (err) {
      setError(errorMessage(err));
      return false;
    } finally {
      setBusy(false);
    }
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(invite.invite_link);
      setCopied(true);
    } catch {
      setError("Could not copy. Select the link and copy it by hand.");
    }
  };

  const handleInvite = async (e) => {
    e.preventDefault();
    const sent = await run(() => inviteUser(form), `${form.email} is invited.`);
    if (sent) setForm(emptyForm);
  };

  return (
    <div>
      <h1 className="text-3xl font-extrabold text-custom-blue mb-6">People</h1>

      <form onSubmit={handleInvite} className="rounded-2xl border border-gray-200 p-6 mb-8 grid gap-3 sm:grid-cols-2">
        <h2 className="sm:col-span-2 font-bold text-lg">Invite someone</h2>
        <input className={inputClass} name="first_name" placeholder="First name" value={form.first_name} onChange={change} />
        <input className={inputClass} name="last_name" placeholder="Last name" value={form.last_name} onChange={change} />
        <input className={inputClass} type="email" name="email" placeholder="Email" value={form.email} onChange={change} required />
        <select className={inputClass} name="role" value={form.role} onChange={change}>
          {Object.entries(roleLabels).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
        <div className="sm:col-span-2 flex flex-wrap items-center gap-4">
          <button type="submit" disabled={busy} className="px-6 py-3 rounded-full bg-custom-blue text-white font-semibold cursor-pointer disabled:opacity-60">
            Send invitation
          </button>
          {message && <span role="status" className="text-green-700 text-sm">{message}</span>}
          {error && <span role="alert" className="text-red-600 text-sm">{error}</span>}
        </div>
      </form>

      {invite && (
        <div role="status" className="rounded-2xl bg-blue-50 p-4 mb-8 text-sm">
          <p className="mb-2">
            {invite.email_sent
              ? `We emailed ${invite.email}. You can also send them this link yourself:`
              : `No email was sent. Send ${invite.email} this link yourself (WhatsApp, for example):`}
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <input readOnly value={invite.invite_link} onFocus={(e) => e.target.select()}
              className="flex-1 min-w-60 border border-gray-300 rounded px-3 py-2 bg-white" />
            <button type="button" onClick={copyLink}
              className="px-4 py-2 rounded-full bg-custom-blue text-white cursor-pointer">
              {copied ? "Copied" : "Copy link"}
            </button>
          </div>
          <p className="text-gray-500 mt-2">The link works once and expires in 7 days.</p>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-300 text-gray-600">
              <th className="py-2 pr-4">Name</th>
              <th className="py-2 pr-4">Email</th>
              <th className="py-2 pr-4">Role</th>
              <th className="py-2 pr-4">Account</th>
              <th className="py-2" />
            </tr>
          </thead>
          <tbody>
            {people.map((person) => {
              const isMe = person.id === me.id;
              return (
                <tr key={person.id} className="border-b border-gray-100">
                  <td className="py-2 pr-4">{`${person.first_name} ${person.last_name}`.trim() || "—"}</td>
                  <td className="py-2 pr-4">{person.email || "—"}</td>
                  <td className="py-2 pr-4">
                    <select
                      value={person.role}
                      disabled={busy || isMe}
                      aria-label={`Role for ${person.email}`}
                      onChange={(e) => run(() => updateUser(person.id, { role: e.target.value }), "Role changed.")}
                      className="border border-gray-300 rounded px-2 py-1"
                    >
                      {Object.entries(roleLabels).map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                  </td>
                  <td className="py-2 pr-4">{person.is_active ? "Active" : "Switched off"}</td>
                  <td className="py-2 space-x-3 whitespace-nowrap">
                    {!isMe && (
                      <button
                        disabled={busy}
                        className="text-custom-blue underline cursor-pointer"
                        onClick={() => run(
                          () => updateUser(person.id, { is_active: !person.is_active }),
                          person.is_active ? "Account switched off." : "Account switched on."
                        )}
                      >
                        {person.is_active ? "Switch off" : "Switch on"}
                      </button>
                    )}
                    {person.is_active && !isMe && person.email && (
                      <button
                        disabled={busy}
                        className="text-custom-blue underline cursor-pointer"
                        onClick={() => run(() => resendInvitation(person.id), `New invitation link for ${person.email}.`)}
                      >
                        New invitation link
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

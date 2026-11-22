import React, { useState } from "react";
import { useLoaderData, useRevalidator } from "react-router";
import {
  inviteUser,
  makeNewSignupLink,
  setSignupLinkActive,
  updateUser,
} from "../../Api";
import { errorMessage } from "../../Api/client";
import { inputClass } from "../../Components/AuthCard";
import CopyLink from "./CopyLink";
import { roleLabels } from "./roles";

const emptyForm = { email: "", first_name: "", last_name: "", role: "member" };

const whatsappShare = (link) =>
  "https://wa.me/?text=" +
  encodeURIComponent(`Join the Kitisuru SDA Church family online. Sign up here: ${link}`);

const fullName = (p) => `${p.first_name} ${p.last_name}`.trim() || "—";

// Admin only: the shared sign-up link, people waiting for approval, and
// individual invitations. Everyone else is managed on the Members page.
export default function SignUpAccess() {
  const { people, signupLink } = useLoaderData();
  const revalidator = useRevalidator();
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState("");
  // The link to send by hand after inviting someone one-to-one.
  const [invite, setInvite] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // Runs an action, shows its result, then reloads the list.
  const run = async (action, success) => {
    setError("");
    setMessage("");
    setInvite(null);
    setBusy(true);
    try {
      const result = await action();
      setMessage(success);
      if (result?.invite_link) setInvite(result);
      revalidator.revalidate();
      return true;
    } catch (err) {
      setError(errorMessage(err));
      return false;
    } finally {
      setBusy(false);
    }
  };

  const handleInvite = async (e) => {
    e.preventDefault();
    const sent = await run(() => inviteUser(form), `${form.email} is invited.`);
    if (sent) setForm(emptyForm);
  };

  const waiting = people.filter((p) => !p.approved && p.is_active);
  return (
    <div>
      <h1 className="text-3xl font-extrabold text-custom-blue mb-6">Sign-up & invitations</h1>

      {(message || error) && (
        <p role={error ? "alert" : "status"} className={`mb-4 text-sm ${error ? "text-red-600" : "text-green-700"}`}>
          {error || message}
        </p>
      )}

      <section className="rounded-2xl border border-gray-200 p-6 mb-8">
        <h2 className="font-bold text-lg mb-1">Sign-up link for the church</h2>
        <p className="text-gray-600 text-sm mb-4">
          Post this one link in the church WhatsApp group. Everyone who uses it fills in their details and waits here for your approval.
        </p>
        {signupLink.link ? (
          <>
            <CopyLink link={signupLink.link}>
              {signupLink.is_active && (
                <a href={whatsappShare(signupLink.link)} target="_blank" rel="noreferrer"
                  className="px-4 py-2 rounded-full border border-green-600 text-green-700">
                  Share on WhatsApp
                </a>
              )}
            </CopyLink>
            <p className="text-sm mt-3">
              Status: <strong>{signupLink.is_active ? "On" : "Switched off"}</strong>
              {" · "}
              <button disabled={busy} className="text-custom-blue underline cursor-pointer"
                onClick={() => run(() => setSignupLinkActive(!signupLink.is_active), signupLink.is_active ? "Sign-up link switched off." : "Sign-up link switched on.")}>
                {signupLink.is_active ? "Switch off" : "Switch on"}
              </button>
              {" · "}
              <button disabled={busy} className="text-custom-blue underline cursor-pointer"
                onClick={() => {
                  if (window.confirm("Make a new link? The old link will stop working.")) {
                    run(makeNewSignupLink, "New sign-up link made. The old one no longer works.");
                  }
                }}>
                Make a new link
              </button>
            </p>
          </>
        ) : (
          <button disabled={busy} onClick={() => run(makeNewSignupLink, "Sign-up link made.")}
            className="px-6 py-3 rounded-full bg-custom-blue text-white font-semibold cursor-pointer disabled:opacity-60">
            Make the sign-up link
          </button>
        )}
      </section>

      {waiting.length > 0 && (
        <section className="rounded-2xl bg-yellow-50 border border-yellow-200 p-6 mb-8">
          <h2 className="font-bold text-lg mb-3">Waiting for approval ({waiting.length})</h2>
          <ul className="divide-y divide-yellow-200">
            {waiting.map((person) => (
              <li key={person.id} className="py-2 flex flex-wrap items-center justify-between gap-3">
                <span>
                  <strong>{fullName(person)}</strong>
                  <span className="text-gray-600 text-sm"> · {person.email} · {person.phone || "no phone"}</span>
                </span>
                <span className="space-x-3">
                  <button disabled={busy} onClick={() => run(() => updateUser(person.id, { approved: true }), `${fullName(person)} approved.`)}
                    className="px-4 py-1 rounded-full bg-custom-blue text-white cursor-pointer">
                    Approve
                  </button>
                  <button disabled={busy} onClick={() => run(() => updateUser(person.id, { is_active: false }), `${fullName(person)}'s account switched off.`)}
                    className="text-red-600 underline cursor-pointer">
                    Reject
                  </button>
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <form onSubmit={handleInvite} className="rounded-2xl border border-gray-200 p-6 mb-8 grid gap-3 sm:grid-cols-2">
        <h2 className="sm:col-span-2 font-bold text-lg">Invite one person with a role</h2>
        <p className="sm:col-span-2 text-gray-600 text-sm -mt-2">
          For leaders and treasurers, or anyone who needs a role other than member. They are approved straight away.
        </p>
        <input className={inputClass} name="first_name" placeholder="First name" value={form.first_name} onChange={change} />
        <input className={inputClass} name="last_name" placeholder="Last name" value={form.last_name} onChange={change} />
        <input className={inputClass} type="email" name="email" placeholder="Email" value={form.email} onChange={change} required />
        <select className={inputClass} name="role" value={form.role} onChange={change}>
          {Object.entries(roleLabels).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
        <div className="sm:col-span-2">
          <button type="submit" disabled={busy} className="px-6 py-3 rounded-full bg-custom-blue text-white font-semibold cursor-pointer disabled:opacity-60">
            Create invitation
          </button>
        </div>
      </form>

      {invite && (
        <div role="status" className="rounded-2xl bg-blue-50 p-4 mb-8 text-sm">
          <p className="mb-2">
            {invite.email_sent
              ? `We emailed ${invite.email}. You can also send them this link yourself:`
              : `No email was sent. Send ${invite.email} this link yourself (WhatsApp, for example). It works for them only:`}
          </p>
          <CopyLink link={invite.invite_link} />
          <p className="text-gray-500 mt-2">The link works once and expires in 7 days.</p>
        </div>
      )}
    </div>
  );
}

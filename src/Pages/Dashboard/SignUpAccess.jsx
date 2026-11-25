import React, { useState } from "react";
import { useLoaderData, useRevalidator } from "react-router";
import { inviteUser, updateUser } from "../../Api";
import { errorMessage } from "../../Api/client";
import { Check, Link2, MessageCircle, Send, X, LoaderCircle, CircleAlert } from "lucide-react";
import { useToast } from "../../Context/ToastContext";
import CopyLink from "./CopyLink";
import { roleLabels } from "./roles";

const emptyForm = { email: "", first_name: "", last_name: "", role: "member" };

const whatsappShare = (link) =>
  "https://wa.me/?text=" + encodeURIComponent(`Join the Kitisuru SDA Church family online. Sign up here: ${link}`);

const fullName = (p) => `${p.first_name} ${p.last_name}`.trim() || "—";

// Admin only: the shared sign-up link, people waiting for approval, and
// individual invitations. Everyone else is managed on the Members page.
export default function SignUpAccess() {
  const { people } = useLoaderData();
  const signupLink = `${window.location.origin}/join`;
  const revalidator = useRevalidator();
  const [form, setForm] = useState(emptyForm);
  const toast = useToast();
  // The link to send by hand after inviting someone one-to-one.
  const [invite, setInvite] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // Runs an action, shows its result, then reloads the list.
  const run = async (action, success) => {
    setError("");
    setInvite(null);
    setBusy(true);
    try {
      const result = await action();
      toast.success(success);
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
    const sent = await run(() => inviteUser(form), `${form.email} is invited`);
    if (sent) setForm(emptyForm);
  };

  const waiting = people.filter((p) => !p.approved && p.is_active);
  return (
    <div>
      <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold sm:text-4xl">{"Sign-up & invitations"}</h1>
          <p className="mt-1.5 max-w-2xl text-muted">
            How people join the dashboard, and who is waiting for you to approve them.
          </p>
        </div>
      </header>
      <div className="mb-4">
        {error && (
          <p role="alert" className="flex items-start gap-2 rounded-3xl bg-clay-100 px-3.5 py-2.5 text-sm text-clay-700">
            <CircleAlert className="mt-0.5 size-4 shrink-0" />
            {error}
          </p>
        )}
      </div>

      <div className="rounded-3xl border border-line bg-white shadow-card p-5 sm:p-6 mb-6">
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-full bg-forest-50 text-forest-700">
            <Link2 className="size-5" />
          </span>
          <h2 className="text-xl font-semibold">Sign-up page</h2>
          <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-forest-100 text-forest-800">
            Open to everyone
          </span>
        </div>
        <p className="mt-2 mb-4 text-sm text-muted">
          People create their own account on the Sign in page (&ldquo;Create an account&rdquo;), with an email and
          password, and then wait here for your approval. This link opens the same page. It is only a backup you can
          post in the church WhatsApp group.
        </p>
        <CopyLink link={signupLink}>
          <a
            href={whatsappShare(signupLink)}
            className="inline-flex items-center justify-center gap-2 rounded-full font-semibold transition active:translate-y-px disabled:opacity-60 border border-line bg-white text-ink hover:border-forest-600 hover:text-forest-800 px-3 py-1.5 text-sm"
            target="_blank"
            rel="noreferrer"
          >
            <MessageCircle className="size-4" />
            Share on WhatsApp
          </a>
        </CopyLink>
      </div>

      {waiting.length > 0 && (
        <div className="rounded-3xl border border-line bg-white shadow-card p-5 sm:p-6 mb-6 !border-marigold-400/50 !bg-marigold-100/50">
          <h2 className="mb-2 text-xl font-semibold">Waiting for approval ({waiting.length})</h2>
          <ul className="divide-y divide-marigold-400/30">
            {waiting.map((person) => (
              <li key={person.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                <span className="flex items-center gap-3">
                  <span
                    className="size-8 text-xs grid shrink-0 place-items-center rounded-full bg-forest-100 font-semibold text-forest-800"
                    aria-hidden="true"
                  >
                    {(fullName(person) || "")
                      .trim()
                      .split(/\s+/)
                      .slice(0, 2)
                      .map((part) => part[0]?.toUpperCase())
                      .join("") || "?"}
                  </span>
                  <span>
                    <span className="block text-sm font-semibold">{fullName(person)}</span>
                    <span className="block text-xs text-muted">
                      {person.email} · {person.phone || "no phone"}
                    </span>
                  </span>
                </span>
                <span className="flex gap-2">
                  <button
                    type="button"
                    className="inline-flex items-center justify-center gap-2 rounded-full font-semibold transition active:translate-y-px disabled:opacity-60 bg-forest-900 text-paper hover:bg-forest-800 shadow-card px-3 py-1.5 text-sm"
                    disabled={busy}
                    onClick={() => run(() => updateUser(person.id, { approved: true }), `${fullName(person)} approved`)}
                  >
                    <Check className="size-4" />
                    Approve
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center justify-center gap-2 rounded-full font-semibold transition active:translate-y-px disabled:opacity-60 text-forest-800 hover:bg-forest-50 px-3 py-1.5 text-sm"
                    disabled={busy}
                    onClick={() =>
                      run(
                        () => updateUser(person.id, { is_active: false }),
                        `${fullName(person)}'s account switched off`,
                      )
                    }
                  >
                    <X className="size-4" />
                    Reject
                  </button>
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <form
        className="rounded-3xl border border-line bg-white shadow-card p-5 sm:p-6 mb-6 grid gap-4 sm:grid-cols-2"
        onSubmit={handleInvite}
      >
        <div className="sm:col-span-2">
          <h2 className="text-xl font-semibold">Invite one person with a role</h2>
          <p className="mt-1 text-sm text-muted">
            For someone who should be an admin from the start. They are approved straight away.
          </p>
        </div>
        <div>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium">First name</span>
            <input className="input" name="first_name" value={form.first_name} onChange={change} />
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
            <span className="mb-1.5 block text-sm font-medium">
              Email <span className="text-clay-600">*</span>
            </span>
            <input className="input" required type="email" name="email" value={form.email} onChange={change} />
          </label>
        </div>
        <div>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium">Role</span>
            <select className="input" name="role" value={form.role} onChange={change}>
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
        <div className="sm:col-span-2">
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-full font-semibold transition active:translate-y-px disabled:opacity-60 bg-forest-900 text-paper hover:bg-forest-800 shadow-card px-4 py-2.5 text-sm"
            disabled={busy}
          >
            {busy ? <LoaderCircle className="size-4 animate-spin" /> : <Send className="size-4" />}
            Create invitation
          </button>
        </div>
      </form>

      {invite && (
        <div role="status" className="mb-6 rounded-3xl bg-forest-50 p-5 text-sm">
          <p className="mb-3">
            {invite.email_sent
              ? `We emailed ${invite.email}. You can also send them this link yourself:`
              : `No email was sent. Send ${invite.email} this link yourself (WhatsApp, for example). It works for them only:`}
          </p>
          <CopyLink link={invite.invite_link} />
          <p className="mt-2 text-muted">The link works once and expires in 7 days.</p>
        </div>
      )}
    </div>
  );
}

import React, { useState } from "react";
import { useLoaderData, useRevalidator } from "react-router";
import {
  inviteUser,
  updateUser,
} from "../../Api";
import { errorMessage } from "../../Api/client";
import { Check, Link2, MessageCircle, Send, X } from "lucide-react";
import Card from "../../Components/ui/Card";
import Button from "../../Components/ui/Button";
import Badge from "../../Components/ui/Badge";
import Avatar from "../../Components/ui/Avatar";
import PageHeader from "../../Components/ui/PageHeader";
import { Input, Select } from "../../Components/ui/Fields";
import { FormError } from "../../Components/ui/States";
import { useToast } from "../../Context/ToastContext";
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
      <PageHeader title="Sign-up & invitations" description="How people join the dashboard, and who is waiting for you to approve them." />
      <div className="mb-4"><FormError>{error}</FormError></div>

      <Card className="mb-6">
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-full bg-forest-50 text-forest-700"><Link2 className="size-5" /></span>
          <h2 className="text-xl font-semibold">Sign-up page</h2>
          <Badge tone="green">Open to everyone</Badge>
        </div>
        <p className="mt-2 mb-4 text-sm text-muted">
          People create their own account on the Sign in page (&ldquo;Create an account&rdquo;), with an email and password, and then wait here for your approval. This link opens the same page. It is only a backup you can post in the church WhatsApp group.
        </p>
        <CopyLink link={signupLink}>
          <Button size="sm" variant="secondary" icon={MessageCircle} href={whatsappShare(signupLink)} target="_blank" rel="noreferrer">
            Share on WhatsApp
          </Button>
        </CopyLink>
      </Card>

      {waiting.length > 0 && (
        <Card className="mb-6 !border-marigold-400/50 !bg-marigold-100/50">
          <h2 className="mb-2 text-xl font-semibold">Waiting for approval ({waiting.length})</h2>
          <ul className="divide-y divide-marigold-400/30">
            {waiting.map((person) => (
              <li key={person.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                <span className="flex items-center gap-3">
                  <Avatar name={fullName(person)} size="sm" />
                  <span>
                    <span className="block text-sm font-semibold">{fullName(person)}</span>
                    <span className="block text-xs text-muted">{person.email} · {person.phone || "no phone"}</span>
                  </span>
                </span>
                <span className="flex gap-2">
                  <Button size="sm" icon={Check} disabled={busy} onClick={() => run(() => updateUser(person.id, { approved: true }), `${fullName(person)} approved`)}>
                    Approve
                  </Button>
                  <Button size="sm" variant="ghost" icon={X} disabled={busy} onClick={() => run(() => updateUser(person.id, { is_active: false }), `${fullName(person)}'s account switched off`)}>
                    Reject
                  </Button>
                </span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      <Card as="form" onSubmit={handleInvite} className="mb-6 grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <h2 className="text-xl font-semibold">Invite one person with a role</h2>
          <p className="mt-1 text-sm text-muted">
            For leaders and treasurers, or anyone who needs a role other than member. They are approved straight away.
          </p>
        </div>
        <Input label="First name" name="first_name" value={form.first_name} onChange={change} />
        <Input label="Last name" name="last_name" value={form.last_name} onChange={change} />
        <Input label="Email" type="email" name="email" value={form.email} onChange={change} required />
        <Select label="Role" name="role" value={form.role} onChange={change}
          options={Object.entries(roleLabels).map(([value, label]) => ({ value, label }))} />
        <div className="sm:col-span-2">
          <Button type="submit" icon={Send} loading={busy}>Create invitation</Button>
        </div>
      </Card>

      {invite && (
        <div role="status" className="mb-6 rounded-card bg-forest-50 p-5 text-sm">
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

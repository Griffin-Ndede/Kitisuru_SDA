import React, { useMemo, useState } from "react";
import { Link, useLoaderData, useNavigate, useRevalidator } from "react-router";
import {
  ArrowLeft, Calendar, CircleCheck, Clock, HeartHandshake, Mail, MapPin, Pencil, Phone, Trash2, UserMinus, UserPlus,
} from "lucide-react";
import { changeMinistryMembers, deleteMinistry } from "../../Api";
import { errorMessage } from "../../Api/client";
import Card from "../../Components/ui/Card";
import Button from "../../Components/ui/Button";
import Avatar from "../../Components/ui/Avatar";
import Modal from "../../Components/ui/Modal";
import { SearchInput } from "../../Components/ui/Fields";
import { FormError } from "../../Components/ui/States";
import { useToast } from "../../Context/ToastContext";
import MinistryForm from "./MinistryForm";
import { formatDate, photoUrl } from "./ministryHelpers";
import { fullName, matchesSearch } from "./memberHelpers";

const Section = ({ title, children }) => (
  <section>
    <h2 className="mb-3 text-2xl font-semibold">{title}</h2>
    {children}
  </section>
);

// One ministry: what it is, its programs, events, photos and contact people.
// Admins also edit it and manage who belongs to it.
export default function MinistryDetail() {
  const { ministry, members } = useLoaderData();
  const revalidator = useRevalidator();
  const navigate = useNavigate();
  const toast = useToast();
  const [editing, setEditing] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const isAdmin = Boolean(ministry.members);
  const inMinistry = useMemo(() => new Set((ministry.members || []).map((m) => m.id)), [ministry]);
  const candidates = useMemo(
    () => (search.trim() ? members.filter((m) => !inMinistry.has(m.id) && matchesSearch(m, search)).slice(0, 8) : []),
    [members, inMinistry, search]
  );
  const events = [...(ministry.events || [])].sort((a, b) => new Date(a.start_date) - new Date(b.start_date));

  const run = async (action, success) => {
    setError("");
    setBusy(true);
    try {
      await action();
      toast.success(success);
      revalidator.revalidate();
      return true;
    } catch (err) {
      setError(errorMessage(err));
      return false;
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm(`Delete the ${ministry.title} ministry? The people in it stay in the register.`)) {
      if (await run(() => deleteMinistry(ministry.id), "Ministry deleted")) navigate("/dashboard/ministries");
    }
  };

  return (
    <div>
      <Link to="/dashboard/ministries" className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-forest-800 hover:underline">
        <ArrowLeft className="size-4" /> All ministries
      </Link>

      <header className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <span className="grid size-14 shrink-0 place-items-center rounded-full bg-forest-50 text-forest-700"><HeartHandshake className="size-7" /></span>
          <div>
            <h1 className="text-3xl font-semibold sm:text-4xl">{ministry.title}</h1>
            {ministry.mission && <p className="mt-1.5 max-w-2xl text-muted">{ministry.mission}</p>}
          </div>
        </div>
        {isAdmin && (
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" icon={Pencil} onClick={() => setEditing(true)}>Edit</Button>
            <Button variant="danger" size="sm" icon={Trash2} onClick={handleDelete} disabled={busy}>Delete</Button>
          </div>
        )}
      </header>
      <div className="mb-4"><FormError>{error}</FormError></div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <Section title="About us">
            <p className="max-w-2xl leading-relaxed text-ink/80">{ministry.description || "No description yet."}</p>
          </Section>

          <Section title="Programs">
            {ministry.programs.length === 0 ? (
              <p className="text-sm text-muted">No programs listed yet.</p>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {ministry.programs.map((p) => (
                  <Card key={p.id}>
                    <h3 className="text-lg font-semibold">{p.title}</h3>
                    <p className="mt-1 text-sm text-muted">{p.description}</p>
                    <p className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-forest-800"><Clock className="size-4" />{p.schedule}</p>
                  </Card>
                ))}
              </div>
            )}
          </Section>

          <Section title="Events">
            {events.length === 0 ? (
              <p className="text-sm text-muted">No events listed yet.</p>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {events.map((e) => (
                  <Card key={e.id}>
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-lg font-semibold">{e.title}</h3>
                      {new Date(e.end_date) < new Date() && <CircleCheck className="size-5 shrink-0 text-forest-600" aria-label="Past event" />}
                    </div>
                    <p className="mt-1 text-sm text-muted">{e.description}</p>
                    <p className="mt-3 flex items-center gap-1.5 text-sm text-forest-800"><MapPin className="size-4" />{e.location}</p>
                    <p className="mt-1 flex items-center gap-1.5 text-sm text-forest-800"><Calendar className="size-4" />{formatDate(e.start_date)} to {formatDate(e.end_date)}</p>
                  </Card>
                ))}
              </div>
            )}
          </Section>

          {ministry.gallery_images.length > 0 && (
            <Section title="Photos">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {ministry.gallery_images.map((g, i) => (
                  <button key={g.id ?? i} type="button" onClick={() => setPhoto(photoUrl(g.image))} className="overflow-hidden rounded-2xl">
                    <img src={photoUrl(g.image)} alt={`${ministry.title} photo ${i + 1}`} loading="lazy" className="aspect-square w-full object-cover transition hover:scale-105" />
                  </button>
                ))}
              </div>
            </Section>
          )}
        </div>

        <aside className="space-y-6">
          <Card>
            <h2 className="mb-3 text-xl font-semibold">Get in touch</h2>
            {ministry.contacts.length === 0 ? (
              <p className="text-sm text-muted">No contact people listed yet.</p>
            ) : (
              <ul className="space-y-4">
                {ministry.contacts.map((c) => (
                  <li key={c.id} className="flex items-start gap-3">
                    <Avatar name={c.name} />
                    <div className="min-w-0 text-sm">
                      <p className="font-semibold">{c.name}</p>
                      {c.role && <p className="text-muted">{c.role}</p>}
                      {c.phone && <a href={`tel:${c.phone}`} className="mt-1 flex items-center gap-1.5 text-forest-800"><Phone className="size-3.5" />{c.phone}</a>}
                      {c.email && <a href={`mailto:${c.email}`} className="flex items-center gap-1.5 break-all text-forest-800"><Mail className="size-3.5" />{c.email}</a>}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          {isAdmin && (
            <Card>
              <h2 className="mb-3 text-xl font-semibold">Members ({ministry.members.length})</h2>
              <SearchInput value={search} onChange={setSearch} placeholder="Find someone to add" />
              {candidates.length > 0 && (
                <ul className="mt-2 divide-y divide-line/70 rounded-xl border border-line px-3">
                  {candidates.map((m) => (
                    <li key={m.id} className="flex items-center justify-between gap-2 py-2">
                      <span className="min-w-0 truncate text-sm">{fullName(m)}</span>
                      <Button size="sm" variant="secondary" icon={UserPlus} disabled={busy} aria-label={`Add ${fullName(m)}`}
                        onClick={() => run(() => changeMinistryMembers(ministry.id, { add: [m.id] }), `${fullName(m)} added`)}>Add</Button>
                    </li>
                  ))}
                </ul>
              )}
              {search.trim() && candidates.length === 0 && <p className="mt-2 text-sm text-muted">No one else matches.</p>}
              {ministry.members.length === 0 ? (
                <p className="mt-3 text-sm text-muted">No one yet.</p>
              ) : (
                <ul className="mt-3 divide-y divide-line/70">
                  {ministry.members.map((m) => (
                    <li key={m.id} className="flex items-center justify-between gap-2 py-2.5">
                      <span className="flex min-w-0 items-center gap-2.5">
                        <Avatar name={m.name} size="sm" />
                        <span className="min-w-0">
                          <span className="block truncate text-sm font-medium">{m.name}</span>
                          <span className="block truncate text-xs text-muted">{m.phone || m.email}</span>
                        </span>
                      </span>
                      <Button size="sm" variant="ghost" icon={UserMinus} disabled={busy} aria-label={`Remove ${m.name}`}
                        onClick={() => run(() => changeMinistryMembers(ministry.id, { remove: [m.id] }), `${m.name} removed`)} />
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          )}
        </aside>
      </div>

      {editing && (
        <Modal title={`Edit ${ministry.title}`} onClose={() => setEditing(false)}>
          <MinistryForm ministry={ministry} onClose={() => setEditing(false)} onSaved={() => { setEditing(false); revalidator.revalidate(); }} />
        </Modal>
      )}
      {photo && (
        <Modal title={ministry.title} size="lg" onClose={() => setPhoto(null)}>
          <img src={photo} alt="" className="mx-auto max-h-[70vh] rounded-xl object-contain" />
        </Modal>
      )}
    </div>
  );
}

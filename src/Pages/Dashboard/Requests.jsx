import React, { useMemo, useState } from "react";
import { useLoaderData, useRevalidator } from "react-router";
import { Check, HandHeart, Mail, MapPin, Phone, RotateCcw, UserPlus, X } from "lucide-react";
import { updateRequest } from "../../Api";
import { errorMessage } from "../../Api/client";
import Card from "../../Components/ui/Card";
import Button from "../../Components/ui/Button";
import Badge from "../../Components/ui/Badge";
import Modal from "../../Components/ui/Modal";
import PageHeader from "../../Components/ui/PageHeader";
import { EmptyState, FormError } from "../../Components/ui/States";
import { useToast } from "../../Context/ToastContext";
import AddToRegisterDialog from "./AddToRegisterDialog";
import { formatDate } from "./ministryHelpers";

const tabs = [
  { value: "new", label: "New" },
  { value: "done", label: "Done" },
  { value: "dismissed", label: "Dismissed" },
  { value: "all", label: "All" },
];
const statusTone = { new: "gold", done: "green", dismissed: "grey" };
const statusLabel = { new: "New", done: "Done", dismissed: "Dismissed" };

// Admin only: what people sent through the Get involved page. Adding someone
// puts them in the member register and the ministries and clusters chosen here.
export default function Requests() {
  const { requests, clusters, ministries } = useLoaderData();
  const revalidator = useRevalidator();
  const toast = useToast();
  const [tab, setTab] = useState("new");
  const [adding, setAdding] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const shown = useMemo(() => requests.filter((r) => tab === "all" || r.status === tab), [requests, tab]);
  const count = (value) => (value === "all" ? requests.length : requests.filter((r) => r.status === value).length);

  const setStatus = async (request, status, message) => {
    setError("");
    setBusy(true);
    try {
      await updateRequest(request.id, { status });
      toast.success(message);
      revalidator.revalidate();
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Get involved requests"
        description="What people sent through the Get involved page. Add them to the register and their ministries and clusters, or mark them done."
      />
      <div className="mb-4"><FormError>{error}</FormError></div>

      <div role="tablist" className="mb-5 flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.value} type="button" role="tab" aria-selected={tab === t.value} onClick={() => setTab(t.value)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${tab === t.value ? "bg-forest-900 text-white" : "bg-white text-muted ring-1 ring-line hover:text-ink"}`}
          >
            {t.label} <span className="opacity-70">({count(t.value)})</span>
          </button>
        ))}
      </div>

      {shown.length === 0 ? (
        <Card><EmptyState icon={HandHeart} title="Nothing here">New requests from the Get involved page will appear here.</EmptyState></Card>
      ) : (
        <ul className="space-y-4">
          {shown.map((r) => (
            <li key={r.id}>
              <Card>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-xl font-semibold">{r.name}</h2>
                      <Badge tone="green">{r.kind_label}</Badge>
                      <Badge tone={statusTone[r.status]}>{statusLabel[r.status]}</Badge>
                    </div>
                    <p className="mt-1 text-xs text-muted">Sent {formatDate(r.created_at)}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {r.can_add_member && (
                      <Button size="sm" icon={UserPlus} disabled={busy} onClick={() => setAdding(r)}>Add to register</Button>
                    )}
                    {r.status === "new" ? (
                      <>
                        <Button size="sm" variant="secondary" icon={Check} disabled={busy} onClick={() => setStatus(r, "done", "Marked done")}>Mark done</Button>
                        <Button size="sm" variant="ghost" icon={X} disabled={busy} onClick={() => setStatus(r, "dismissed", "Dismissed")}>Dismiss</Button>
                      </>
                    ) : (
                      <Button size="sm" variant="ghost" icon={RotateCcw} disabled={busy} onClick={() => setStatus(r, "new", "Moved back to new")}>Reopen</Button>
                    )}
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm text-forest-800">
                  {r.phone && <a href={`tel:${r.phone}`} className="inline-flex items-center gap-1.5"><Phone className="size-3.5" />{r.phone}</a>}
                  {r.email && <a href={`mailto:${r.email}`} className="inline-flex items-center gap-1.5 break-all"><Mail className="size-3.5" />{r.email}</a>}
                  {r.area && <span className="inline-flex items-center gap-1.5 text-muted"><MapPin className="size-3.5" />{r.area}</span>}
                </div>

                {r.ministries.length > 0 && (
                  <p className="mt-3 flex flex-wrap items-center gap-2 text-sm">
                    <span className="text-muted">Wants to join</span>
                    {r.ministries.map((m) => <Badge key={m.id} tone="gold">{m.title}</Badge>)}
                  </p>
                )}
                {r.member && <p className="mt-3 text-sm font-medium text-forest-700">In the register as {r.member.name}.</p>}

                {r.details.length > 0 && (
                  <details className="mt-3 text-sm">
                    <summary className="cursor-pointer font-medium text-forest-800">Their answers</summary>
                    <dl className="mt-2 space-y-2 rounded-xl bg-paper p-4">
                      {r.details.map((d) => (
                        <div key={d.label}>
                          <dt className="text-xs text-muted">{d.label}</dt>
                          <dd className="whitespace-pre-line">{d.value}</dd>
                        </div>
                      ))}
                    </dl>
                  </details>
                )}
              </Card>
            </li>
          ))}
        </ul>
      )}

      {adding && (
        <Modal title={`Add ${adding.name}`} onClose={() => setAdding(null)}>
          <AddToRegisterDialog
            request={adding} ministries={ministries} clusters={clusters}
            onClose={() => setAdding(null)}
            onSaved={() => { setAdding(null); revalidator.revalidate(); }}
          />
        </Modal>
      )}
    </div>
  );
}

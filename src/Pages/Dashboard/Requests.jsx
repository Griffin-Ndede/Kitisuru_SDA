import React, { useMemo, useState, useEffect } from "react";
import { useLoaderData, useRevalidator } from "react-router";
import { Check, HandHeart, Mail, MapPin, Phone, RotateCcw, UserPlus, X, CircleAlert } from "lucide-react";
import { updateRequest } from "../../Api";
import { errorMessage } from "../../Api/client";
import { useToast } from "../../Context/ToastContext";
import AddToRegisterDialog from "./AddToRegisterDialog";
import { formatDate } from "./ministryHelpers";

const tabs = [
  { value: "new", label: "New" },
  { value: "done", label: "Done" },
  { value: "dismissed", label: "Dismissed" },
  { value: "all", label: "All" },
];
const statusTone = {
  new: "bg-marigold-100 text-marigold-600",
  done: "bg-forest-100 text-forest-800",
  dismissed: "bg-paper-deep text-muted",
};
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

  // A box over the page closes on Escape and stops the page behind it from scrolling
  useEffect(() => {
    if (!adding) return undefined;
    const onKey = (event) => event.key === "Escape" && setAdding(null);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [adding]);

  return (
    <div>
      <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold sm:text-4xl">Get involved requests</h1>
          <p className="mt-1.5 max-w-2xl text-muted">
            What people sent through the Get involved page. Add them to the register and their ministries and clusters,
            or mark them done.
          </p>
        </div>
      </header>
      <div className="mb-4">
        {error && (
          <p role="alert" className="flex items-start gap-2 rounded-xl bg-clay-100 px-3.5 py-2.5 text-sm text-clay-700">
            <CircleAlert className="mt-0.5 size-4 shrink-0" />
            {error}
          </p>
        )}
      </div>

      <div role="tablist" className="mb-5 flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.value}
            type="button"
            role="tab"
            aria-selected={tab === t.value}
            onClick={() => setTab(t.value)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${tab === t.value ? "bg-forest-900 text-white" : "bg-white text-muted ring-1 ring-line hover:text-ink"}`}
          >
            {t.label} <span className="opacity-70">({count(t.value)})</span>
          </button>
        ))}
      </div>

      {shown.length === 0 ? (
        <div className="rounded-card border border-line bg-white shadow-card p-5 sm:p-6">
          <div className="flex flex-col items-center px-6 py-12 text-center">
            <span className="arch grid h-16 w-14 place-items-center bg-forest-50 text-forest-600">
              <HandHeart className="size-6" />
            </span>
            <h3 className="mt-4 text-lg font-semibold">Nothing here</h3>
            <p className="mt-1 max-w-sm text-sm text-muted">
              New requests from the Get involved page will appear here.
            </p>
          </div>
        </div>
      ) : (
        <ul className="space-y-4">
          {shown.map((r) => (
            <li key={r.id}>
              <div className="rounded-card border border-line bg-white shadow-card p-5 sm:p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-xl font-semibold">{r.name}</h2>
                      <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-forest-100 text-forest-800">
                        {r.kind_label}
                      </span>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusTone[r.status]}`}
                      >
                        {statusLabel[r.status]}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-muted">Sent {formatDate(r.created_at)}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {r.can_add_member && (
                      <button
                        type="button"
                        className="inline-flex items-center justify-center gap-2 rounded-full font-semibold transition active:translate-y-px disabled:opacity-60 bg-forest-900 text-paper hover:bg-forest-800 shadow-card px-3 py-1.5 text-sm"
                        disabled={busy}
                        onClick={() => setAdding(r)}
                      >
                        <UserPlus className="size-4" />
                        Add to register
                      </button>
                    )}
                    {r.status === "new" ? (
                      <>
                        <button
                          type="button"
                          className="inline-flex items-center justify-center gap-2 rounded-full font-semibold transition active:translate-y-px disabled:opacity-60 border border-line bg-white text-ink hover:border-forest-600 hover:text-forest-800 px-3 py-1.5 text-sm"
                          disabled={busy}
                          onClick={() => setStatus(r, "done", "Marked done")}
                        >
                          <Check className="size-4" />
                          Mark done
                        </button>
                        <button
                          type="button"
                          className="inline-flex items-center justify-center gap-2 rounded-full font-semibold transition active:translate-y-px disabled:opacity-60 text-forest-800 hover:bg-forest-50 px-3 py-1.5 text-sm"
                          disabled={busy}
                          onClick={() => setStatus(r, "dismissed", "Dismissed")}
                        >
                          <X className="size-4" />
                          Dismiss
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        className="inline-flex items-center justify-center gap-2 rounded-full font-semibold transition active:translate-y-px disabled:opacity-60 text-forest-800 hover:bg-forest-50 px-3 py-1.5 text-sm"
                        disabled={busy}
                        onClick={() => setStatus(r, "new", "Moved back to new")}
                      >
                        <RotateCcw className="size-4" />
                        Reopen
                      </button>
                    )}
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm text-forest-800">
                  {r.phone && (
                    <a href={`tel:${r.phone}`} className="inline-flex items-center gap-1.5">
                      <Phone className="size-3.5" />
                      {r.phone}
                    </a>
                  )}
                  {r.email && (
                    <a href={`mailto:${r.email}`} className="inline-flex items-center gap-1.5 break-all">
                      <Mail className="size-3.5" />
                      {r.email}
                    </a>
                  )}
                  {r.area && (
                    <span className="inline-flex items-center gap-1.5 text-muted">
                      <MapPin className="size-3.5" />
                      {r.area}
                    </span>
                  )}
                </div>

                {r.ministries.length > 0 && (
                  <p className="mt-3 flex flex-wrap items-center gap-2 text-sm">
                    <span className="text-muted">Wants to join</span>
                    {r.ministries.map((m) => (
                      <span
                        className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-marigold-100 text-marigold-600"
                        key={m.id}
                      >
                        {m.title}
                      </span>
                    ))}
                  </p>
                )}
                {r.member && (
                  <p className="mt-3 text-sm font-medium text-forest-700">In the register as {r.member.name}.</p>
                )}

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
              </div>
            </li>
          ))}
        </ul>
      )}

      {adding && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6">
          <div
            className="absolute inset-0 bg-forest-950/50 backdrop-blur-[2px]"
            onClick={() => setAdding(null)}
            aria-hidden="true"
          />
          <div
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-label={`Add ${adding.name}`}
            className="rise relative flex max-h-[92vh] w-full flex-col rounded-t-3xl bg-white shadow-lift outline-none sm:rounded-3xl sm:max-w-xl"
          >
            <header className="flex items-start justify-between gap-4 border-b border-line px-5 py-4 sm:px-6">
              <div>
                <h2 className="text-xl font-semibold">{`Add ${adding.name}`}</h2>
              </div>
              <button
                type="button"
                onClick={() => setAdding(null)}
                aria-label="Close"
                className="rounded-full p-1.5 text-muted hover:bg-paper-deep hover:text-ink"
              >
                <X className="size-5" />
              </button>
            </header>
            <div className="overflow-y-auto px-5 py-5 sm:px-6">
              <AddToRegisterDialog
                request={adding}
                ministries={ministries}
                clusters={clusters}
                onClose={() => setAdding(null)}
                onSaved={() => {
                  setAdding(null);
                  revalidator.revalidate();
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

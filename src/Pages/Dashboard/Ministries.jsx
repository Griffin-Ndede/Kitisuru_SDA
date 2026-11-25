import React, { useState, useEffect } from "react";
import { Link, useLoaderData, useNavigate } from "react-router";
import { HeartHandshake, Plus, Users, X } from "lucide-react";
import MinistryForm from "./MinistryForm";
import { photoUrl } from "./ministryHelpers";
import { useUser } from "../../Context/UserContext";

// Every approved member can browse the ministries (Youth, Children, Women...).
// Admins can add new ones; each ministry's own page has the details.
export default function Ministries() {
  const { ministries } = useLoaderData();
  const { user, isAdmin } = useUser();
  const navigate = useNavigate();
  const [adding, setAdding] = useState(false);

  const mine = new Set(user.ministries.map((m) => m.id));

  // A box over the page closes on Escape and stops the page behind it from scrolling
  useEffect(() => {
    if (!adding) return undefined;
    const onKey = (event) => event.key === "Escape" && setAdding(false);
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
          <h1 className="text-3xl font-semibold sm:text-4xl">Ministries</h1>
          <p className="mt-1.5 max-w-2xl text-muted">
            {"The church's ministries. Find where you can serve and who to talk to."}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {isAdmin && (
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-full font-semibold transition active:translate-y-px disabled:opacity-60 bg-forest-900 text-paper hover:bg-forest-800 shadow-card px-4 py-2.5 text-sm"
              onClick={() => setAdding(true)}
            >
              <Plus className="size-4" />
              Add ministry
            </button>
          )}
        </div>
      </header>

      {ministries.length === 0 ? (
        <div className="rounded-card border border-line bg-white shadow-card p-5 sm:p-6">
          <div className="flex flex-col items-center px-6 py-12 text-center">
            <span className="arch grid h-16 w-14 place-items-center bg-forest-50 text-forest-600">
              <HeartHandshake className="size-6" />
            </span>
            <h3 className="mt-4 text-lg font-semibold">No ministries yet</h3>
            <p className="mt-1 max-w-sm text-sm text-muted">
              {isAdmin ? "Add the first one with the button above." : "The church office has not added any yet."}
            </p>
          </div>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {ministries.map((m) => (
            <Link key={m.id} to={`/dashboard/ministries/${m.id}`} className="group block">
              <div className="rounded-card border border-line bg-white shadow-card h-full overflow-hidden transition group-hover:-translate-y-0.5 group-hover:shadow-lift">
                <div className="relative h-36 bg-forest-50">
                  {photoUrl(m.image) ? (
                    <img src={photoUrl(m.image)} alt="" loading="lazy" className="size-full object-cover" />
                  ) : (
                    <span className="grid size-full place-items-center text-forest-600">
                      <HeartHandshake className="size-10" />
                    </span>
                  )}
                  {mine.has(m.id) && (
                    <span className="absolute top-3 left-3">
                      <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-marigold-100 text-marigold-600">
                        You belong
                      </span>
                    </span>
                  )}
                </div>
                <div className="p-5">
                  <h2 className="text-xl font-semibold">{m.title}</h2>
                  <p className="mt-1 line-clamp-2 text-sm text-muted">
                    {m.mission || m.description || "No description yet."}
                  </p>
                  <p className="mt-3 inline-flex items-center gap-1.5 text-xs text-muted">
                    <Users className="size-3.5" />
                    {m.member_count} members
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {adding && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6">
          <div
            className="absolute inset-0 bg-forest-950/50 backdrop-blur-[2px]"
            onClick={() => setAdding(false)}
            aria-hidden="true"
          />
          <div
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-label={"Add a ministry"}
            className="rise relative flex max-h-[92vh] w-full flex-col rounded-t-3xl bg-white shadow-lift outline-none sm:rounded-3xl sm:max-w-xl"
          >
            <header className="flex items-start justify-between gap-4 border-b border-line px-5 py-4 sm:px-6">
              <div>
                <h2 className="text-xl font-semibold">Add a ministry</h2>
              </div>
              <button
                type="button"
                onClick={() => setAdding(false)}
                aria-label="Close"
                className="rounded-full p-1.5 text-muted hover:bg-paper-deep hover:text-ink"
              >
                <X className="size-5" />
              </button>
            </header>
            <div className="overflow-y-auto px-5 py-5 sm:px-6">
              <MinistryForm
                ministry={null}
                onClose={() => setAdding(false)}
                onSaved={(saved) => navigate(`/dashboard/ministries/${saved.id}`)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

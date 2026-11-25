import React, { useMemo, useState, useEffect } from "react";
import { useLoaderData } from "react-router";
import { BookOpenText, FileText, LoaderCircle, X, Search, CircleAlert } from "lucide-react";
import { getDocumentFileUrl } from "../../Api";
import { errorMessage } from "../../Api/client";
import { formatDate } from "./ministryHelpers";

// The church's study materials (PDFs), for every approved member.
export default function Library() {
  const { documents } = useLoaderData();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [open, setOpen] = useState(null); // { doc, url, error }

  const categories = useMemo(
    () => [...new Set(documents.map((d) => d.category?.name).filter(Boolean))].sort(),
    [documents],
  );
  const shown = useMemo(() => {
    const words = search.toLowerCase().split(/\s+/).filter(Boolean);
    return documents
      .filter((d) => !category || d.category?.name === category)
      .filter((d) => words.every((w) => `${d.title} ${d.description}`.toLowerCase().includes(w)))
      .sort((a, b) => a.title.localeCompare(b.title));
  }, [documents, search, category]);

  // The PDF needs the sign-in token, so it is fetched when someone opens it.
  const handleOpen = async (doc) => {
    setOpen({ doc, url: null, error: "" });
    try {
      setOpen({ doc, url: await getDocumentFileUrl(doc.slug), error: "" });
    } catch (err) {
      setOpen({ doc, url: null, error: errorMessage(err, "Could not open this document.") });
    }
  };

  const handleClose = () => {
    if (open?.url) URL.revokeObjectURL(open.url);
    setOpen(null);
  };

  // A box over the page closes on Escape and stops the page behind it from scrolling
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event) => {
      if (event.key !== "Escape") return;
      if (open.url) URL.revokeObjectURL(open.url);
      setOpen(null);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div>
      <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold sm:text-4xl">Library</h1>
          <p className="mt-1.5 max-w-2xl text-muted">Study materials and documents from the church.</p>
        </div>
      </header>

      <div className="mb-4 grid gap-3 sm:grid-cols-3">
        <div className="relative sm:col-span-2">
          <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted" />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={"Search the library"}
            aria-label={"Search the library"}
            className="input pl-10"
          />
        </div>
        <div>
          <select
            className="input"
            aria-label="Filter by category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>
      <p className="mb-4 text-sm text-muted" aria-live="polite">
        Showing {shown.length} of {documents.length}
      </p>

      {shown.length === 0 ? (
        <div className="rounded-3xl border border-line bg-white shadow-card p-5 sm:p-6">
          <div className="flex flex-col items-center px-6 py-12 text-center">
            <span className="arch grid h-16 w-14 place-items-center bg-forest-50 text-forest-600">
              <BookOpenText className="size-6" />
            </span>
            <h3 className="mt-4 text-lg font-semibold">Nothing found</h3>
            <p className="mt-1 max-w-sm text-sm text-muted">Try a different search or category.</p>
          </div>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((doc) => (
            <div className="rounded-3xl border border-line bg-white shadow-card p-5 sm:p-6 flex flex-col" key={doc.id}>
              <span className="grid size-10 place-items-center rounded-full bg-forest-50 text-forest-700">
                <FileText className="size-5" />
              </span>
              <h2 className="mt-3 text-lg font-semibold">{doc.title}</h2>
              <p className="mt-1 line-clamp-3 flex-1 text-sm text-muted">{doc.description}</p>
              <div className="mt-4 flex items-center justify-between gap-2">
                <span className="flex flex-wrap items-center gap-2 text-xs text-muted">
                  {doc.category?.name && (
                    <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-forest-100 text-forest-800">
                      {doc.category.name}
                    </span>
                  )}
                  {doc.publish_date && formatDate(doc.publish_date)}
                </span>
                <button
                  type="button"
                  className="inline-flex items-center justify-center gap-2 rounded-full font-semibold transition active:translate-y-px disabled:opacity-60 bg-forest-900 text-paper hover:bg-forest-800 shadow-card px-3 py-1.5 text-sm"
                  onClick={() => handleOpen(doc)}
                >
                  Read
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6">
          <div
            className="absolute inset-0 bg-forest-950/50 backdrop-blur-[2px]"
            onClick={handleClose}
            aria-hidden="true"
          />
          <div
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-label={open.doc.title}
            className="rise relative flex max-h-[92vh] w-full flex-col rounded-t-3xl bg-white shadow-lift outline-none sm:rounded-3xl sm:max-w-6xl"
          >
            <header className="flex items-start justify-between gap-4 border-b border-line px-5 py-4 sm:px-6">
              <div>
                <h2 className="text-xl font-semibold">{open.doc.title}</h2>
              </div>
              <button
                type="button"
                onClick={handleClose}
                aria-label="Close"
                className="rounded-full p-1.5 text-muted hover:bg-paper-deep hover:text-ink"
              >
                <X className="size-5" />
              </button>
            </header>
            <div className="overflow-y-auto px-5 py-5 sm:px-6">
              {open.error ? (
                <p
                  role="alert"
                  className="flex items-start gap-2 rounded-3xl bg-clay-100 px-3.5 py-2.5 text-sm text-clay-700"
                >
                  <CircleAlert className="mt-0.5 size-4 shrink-0" />
                  {open.error}
                </p>
              ) : !open.url ? (
                <div role="status" className="flex items-center justify-center gap-2 py-12 text-muted">
                  <LoaderCircle className="size-5 animate-spin" /> <span className="text-sm">Opening</span>
                </div>
              ) : (
                <iframe
                  src={`${open.url}#toolbar=1&navpanes=0&zoom=page-width`}
                  title={open.doc.title}
                  className="h-[70vh] w-full rounded-3xl border border-line"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

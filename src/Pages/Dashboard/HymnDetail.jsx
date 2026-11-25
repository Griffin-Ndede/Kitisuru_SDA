import React, { useState } from "react";
import { Link, useLoaderData, useRevalidator } from "react-router";
import { ArrowLeft, ArrowRight, Heart, Minus, Plus } from "lucide-react";
import { favouriteHymn, unfavouriteHymn } from "../../Api";
import { errorMessage } from "../../Api/client";
import { useToast } from "../../Context/ToastContext";

// The reading sizes, smallest to largest
const sizes = ["text-base", "text-lg", "text-xl", "text-2xl", "text-3xl"];

// Reads the saved size, if the browser allows it
const savedSize = () => {
  try {
    const value = Number(localStorage.getItem("hymn-text-size"));
    return Number.isInteger(value) && value >= 0 && value < sizes.length ? value : 1;
  } catch {
    return 1;
  }
};

// One hymn, big and easy to read: verses numbered, the refrain set apart.
export default function HymnDetail() {
  const { hymn, siblings } = useLoaderData();
  const revalidator = useRevalidator();
  const toast = useToast();
  const [size, setSize] = useState(savedSize);

  const position = siblings.findIndex((h) => h.id === hymn.id);
  const previous = position > 0 ? siblings[position - 1] : null;
  const next = position >= 0 && position < siblings.length - 1 ? siblings[position + 1] : null;
  const bookName = hymn.language === "en" ? "SDA Hymnal" : "Christ In Song";

  const handleSize = (change) => {
    const value = Math.min(sizes.length - 1, Math.max(0, size + change));
    setSize(value);
    try {
      localStorage.setItem("hymn-text-size", String(value));
    } catch {
      // the size just is not remembered
    }
  };

  const handleFavourite = async () => {
    try {
      await (hymn.is_favourite ? unfavouriteHymn(hymn.id) : favouriteHymn(hymn.id));
      toast.success(hymn.is_favourite ? "Removed from your favourites" : "Added to your favourites");
      revalidator.revalidate();
    } catch (err) {
      toast.error(errorMessage(err));
    }
  };

  // Verses are numbered by their own index; a refrain has no number
  let verseCount = 0;

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        to={`/dashboard/hymnal?language=${hymn.language}`}
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-forest-800 hover:underline"
      >
        <ArrowLeft className="size-4" /> All {hymn.language_label} hymns
      </Link>

      <header className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <span className="grid size-16 shrink-0 place-items-center rounded-3xl bg-marigold-500 font-display text-2xl font-semibold text-forest-950">
            {hymn.number}
          </span>
          <div>
            <p className="eyebrow">
              {bookName} · {hymn.language_label}
            </p>
            <h1 className="mt-1 text-3xl font-semibold sm:text-4xl">{hymn.title}</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-full border border-line bg-white" role="group" aria-label="Text size">
            <button
              type="button"
              aria-label="Smaller text"
              disabled={size === 0}
              onClick={() => handleSize(-1)}
              className="grid size-10 place-items-center rounded-full text-ink transition hover:bg-forest-50 disabled:opacity-40"
            >
              <Minus className="size-4" />
            </button>
            <span className="px-1 text-sm font-semibold" aria-hidden="true">
              Aa
            </span>
            <button
              type="button"
              aria-label="Larger text"
              disabled={size === sizes.length - 1}
              onClick={() => handleSize(1)}
              className="grid size-10 place-items-center rounded-full text-ink transition hover:bg-forest-50 disabled:opacity-40"
            >
              <Plus className="size-4" />
            </button>
          </div>
          <button
            type="button"
            aria-pressed={hymn.is_favourite}
            onClick={handleFavourite}
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition active:translate-y-px ${
              hymn.is_favourite
                ? "bg-marigold-500 text-forest-950 shadow-card"
                : "border border-line bg-white text-ink hover:border-marigold-500"
            }`}
          >
            <Heart className={`size-4 ${hymn.is_favourite ? "fill-forest-950" : ""}`} />
            {hymn.is_favourite ? "Saved" : "Save"}
          </button>
        </div>
      </header>

      <article className="space-y-6 rounded-card border border-line bg-white p-6 shadow-card sm:p-10">
        {hymn.lyrics.map((block, i) => {
          if (block.type === "refrain") {
            return (
              <section
                key={i}
                aria-label="Refrain"
                className="rounded-3xl border-l-4 border-marigold-500 bg-marigold-100/60 px-5 py-4 sm:px-6"
              >
                <p className="mb-1.5 text-xs font-semibold tracking-[0.16em] text-marigold-600 uppercase">Refrain</p>
                <p className={`${sizes[size]} leading-relaxed whitespace-pre-line italic`}>{block.lines.join("\n")}</p>
              </section>
            );
          }
          verseCount += 1;
          return (
            <section key={i} className="flex gap-4 sm:gap-6">
              <span
                className="grid size-9 shrink-0 place-items-center rounded-full bg-forest-50 text-sm font-semibold text-forest-900"
                aria-label={`Verse ${block.index ?? verseCount}`}
              >
                {block.index ?? verseCount}
              </span>
              <p className={`${sizes[size]} leading-relaxed whitespace-pre-line`}>{block.lines.join("\n")}</p>
            </section>
          );
        })}
      </article>

      <nav aria-label="Other hymns" className="mt-6 flex items-stretch justify-between gap-3">
        {previous ? (
          <Link
            to={`/dashboard/hymnal/${previous.id}`}
            className="flex min-w-0 flex-1 items-center gap-3 rounded-card border border-line bg-white p-4 shadow-card transition hover:border-forest-600"
          >
            <ArrowLeft className="size-5 shrink-0 text-forest-800" />
            <span className="min-w-0">
              <span className="block text-xs text-muted">Previous</span>
              <span className="block truncate text-sm font-medium">
                {previous.number}. {previous.title}
              </span>
            </span>
          </Link>
        ) : (
          <span className="flex-1" />
        )}
        {next ? (
          <Link
            to={`/dashboard/hymnal/${next.id}`}
            className="flex min-w-0 flex-1 items-center justify-end gap-3 rounded-card border border-line bg-white p-4 text-right shadow-card transition hover:border-forest-600"
          >
            <span className="min-w-0">
              <span className="block text-xs text-muted">Next</span>
              <span className="block truncate text-sm font-medium">
                {next.number}. {next.title}
              </span>
            </span>
            <ArrowRight className="size-5 shrink-0 text-forest-800" />
          </Link>
        ) : (
          <span className="flex-1" />
        )}
      </nav>
    </div>
  );
}

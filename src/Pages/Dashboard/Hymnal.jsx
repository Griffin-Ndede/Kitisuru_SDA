import React, { useEffect, useRef, useState } from "react";
import { Link, useLoaderData, useRevalidator, useSearchParams } from "react-router";
import { Heart, Music2, Search } from "lucide-react";
import { favouriteHymn, hymnLanguages, unfavouriteHymn } from "../../Api";
import { errorMessage } from "../../Api/client";
import { useToast } from "../../Context/ToastContext";

// The church hymnal: five books, search by number, title or words, and a heart
// to keep favourites. Any approved member can read it.
export default function Hymnal() {
  const { hymns, language, search, favourites } = useLoaderData();
  const [, setSearchParams] = useSearchParams();
  const revalidator = useRevalidator();
  const toast = useToast();
  const [typed, setTyped] = useState(search);
  const timer = useRef(null);

  const book = hymnLanguages.find((l) => l.code === language);
  const bookName = language === "en" ? "SDA Hymnal" : "Christ In Song";
  const tabLink = (code) => `/dashboard/hymnal?${new URLSearchParams({ language: code, ...(typed.trim() && { search: typed.trim() }) })}`;
  const favouritesLink = `/dashboard/hymnal?${new URLSearchParams({ favourites: "true", language, ...(typed.trim() && { search: typed.trim() }) })}`;

  // Search while typing, a moment after the last key, without adding a history step per letter
  const handleSearch = (event) => {
    const value = event.target.value;
    setTyped(value);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      const next = { language };
      if (favourites) next.favourites = "true";
      if (value.trim()) next.search = value.trim();
      setSearchParams(next, { replace: true });
    }, 300);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    clearTimeout(timer.current);
    const next = { language };
    if (favourites) next.favourites = "true";
    if (typed.trim()) next.search = typed.trim();
    setSearchParams(next, { replace: true });
  };

  const handleFavourite = async (hymn) => {
    try {
      await (hymn.is_favourite ? unfavouriteHymn(hymn.id) : favouriteHymn(hymn.id));
      toast.success(hymn.is_favourite ? "Removed from your favourites" : "Added to your favourites");
      revalidator.revalidate();
    } catch (err) {
      toast.error(errorMessage(err));
    }
  };

  // Stop a pending search if the page goes away
  useEffect(() => () => clearTimeout(timer.current), []);

  return (
    <div>
      <header className="mb-6">
        <h1 className="text-3xl font-semibold sm:text-4xl">Hymnal</h1>
        <p className="mt-1.5 max-w-2xl text-muted">
          {favourites
            ? "Your favourite hymns, from every book."
            : `${bookName} in ${book.label}. Search by number, title or a few words from the hymn.`}
        </p>
      </header>

      <nav aria-label="Hymnal books" className="mb-4 flex flex-wrap gap-2">
        {hymnLanguages.map((l) => (
          <Link
            key={l.code}
            to={tabLink(l.code)}
            aria-current={!favourites && l.code === language ? "page" : undefined}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              !favourites && l.code === language
                ? "bg-forest-900 text-white shadow-card"
                : "border border-line bg-white text-ink hover:border-forest-600 hover:text-forest-800"
            }`}
          >
            {l.label}
          </Link>
        ))}
        <Link
          to={favouritesLink}
          aria-current={favourites ? "page" : undefined}
          className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition ${
            favourites
              ? "bg-marigold-500 text-forest-950 shadow-card"
              : "border border-line bg-white text-ink hover:border-marigold-500"
          }`}
        >
          <Heart className="size-4" />
          Favourites
        </Link>
      </nav>

      <form className="relative mb-2" role="search" onSubmit={handleSubmit}>
        <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted" />
        <input
          type="search"
          value={typed}
          onChange={handleSearch}
          placeholder="Number, title or words"
          aria-label="Search hymns by number, title or words"
          className="input pl-11"
        />
      </form>
      <p className="mb-5 text-sm text-muted" role="status">
        {hymns.length} {hymns.length === 1 ? "hymn" : "hymns"}
        {search && ` matching “${search}”`}
      </p>

      {hymns.length === 0 ? (
        <div className="flex flex-col items-center rounded-card border border-line bg-white px-6 py-14 text-center shadow-card">
          <span className="arch grid h-16 w-14 place-items-center bg-forest-50 text-forest-600">
            {favourites ? <Heart className="size-6" /> : <Music2 className="size-6" />}
          </span>
          <h2 className="mt-4 text-lg font-semibold">
            {search ? "No hymn matches" : favourites ? "No favourites yet" : "No hymns here yet"}
          </h2>
          <p className="mt-1 max-w-sm text-sm text-muted">
            {search
              ? "Try a different word, or type just a number to go to that hymn."
              : favourites
                ? "Tap the heart on a hymn to keep it here."
                : "The church office has not loaded this book yet."}
          </p>
        </div>
      ) : (
        <ul className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {hymns.map((hymn) => (
            <li key={hymn.id} className="relative">
              <Link
                to={`/dashboard/hymnal/${hymn.id}`}
                className="flex items-center gap-4 rounded-card border border-line bg-white p-4 pr-16 shadow-card transition hover:border-forest-600"
              >
                <span className="grid size-12 shrink-0 place-items-center rounded-3xl bg-forest-50 font-display text-lg font-semibold text-forest-900">
                  {hymn.number}
                </span>
                <span className="min-w-0">
                  <span className="line-clamp-2 block font-medium">{hymn.title}</span>
                  {favourites && <span className="block text-xs text-muted">{hymn.language_label}</span>}
                </span>
              </Link>
              <button
                type="button"
                aria-pressed={hymn.is_favourite}
                aria-label={hymn.is_favourite ? `Remove ${hymn.title} from favourites` : `Add ${hymn.title} to favourites`}
                onClick={() => handleFavourite(hymn)}
                className="absolute top-1/2 right-3 grid size-10 -translate-y-1/2 place-items-center rounded-full text-muted transition hover:bg-marigold-100 hover:text-marigold-600"
              >
                <Heart className={`size-5 ${hymn.is_favourite ? "fill-marigold-500 text-marigold-500" : ""}`} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

import React from "react";
import { Link } from "react-router";

// The arch-and-sunrise mark with the church name. `tone` flips it for dark backgrounds.
export default function Logo({ to = "/", tone = "dark", compact = false }) {
  const text = tone === "light" ? "text-paper" : "text-forest-900";
  return (
    <Link to={to} className={`inline-flex items-center gap-2.5 ${text}`} aria-label="Kitisuru SDA Church, home">
      <svg viewBox="0 0 32 32" className="size-9 shrink-0" aria-hidden="true">
        <rect width="32" height="32" rx="9" className={tone === "light" ? "fill-paper/10" : "fill-forest-900"} />
        <path d="M9 25V15a7 7 0 0 1 14 0v10" fill="none" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" />
        <circle cx="16" cy="19" r="3.4" fill="#FFC700" />
      </svg>
      {!compact && (
        <span className="leading-none">
          <span className="block font-display text-lg font-semibold tracking-tight">Kitisuru</span>
          <span className="block text-[0.65rem] font-semibold uppercase tracking-[0.2em] opacity-70">SDA Church</span>
        </span>
      )}
    </Link>
  );
}

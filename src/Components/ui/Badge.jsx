import React from "react";

const TONES = {
  green: "bg-forest-100 text-forest-800",
  gold: "bg-marigold-100 text-marigold-600",
  clay: "bg-clay-100 text-clay-700",
  grey: "bg-paper-deep text-muted",
};

export default function Badge({ tone = "grey", children }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${TONES[tone]}`}>
      {children}
    </span>
  );
}

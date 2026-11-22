import React from "react";

const initials = (name = "") =>
  name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase()).join("") || "?";

export default function Avatar({ name, size = "md" }) {
  const sizes = { sm: "size-8 text-xs", md: "size-10 text-sm", lg: "size-16 text-xl" };
  return (
    <span className={`${sizes[size]} grid shrink-0 place-items-center rounded-full bg-forest-100 font-semibold text-forest-800`} aria-hidden="true">
      {initials(name)}
    </span>
  );
}

import React, { useEffect, useRef, useState } from "react";

// A button that opens a small menu. `trigger` is the button's content; children get `close`.
export default function Dropdown({ trigger, label, align = "right", width = "w-56", buttonClassName = "", children }) {
  const [open, setOpen] = useState(false);
  const root = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onClick = (event) => !root.current?.contains(event.target) && setOpen(false);
    const onKey = (event) => event.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={root} className="relative">
      <button type="button" aria-haspopup="menu" aria-expanded={open} aria-label={label} onClick={() => setOpen((o) => !o)} className={buttonClassName}>
        {trigger}
      </button>
      {open && (
        <div role="menu" className={`rise absolute z-40 mt-2 ${width} max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-line bg-white py-1.5 shadow-lift ${align === "right" ? "right-0" : "left-0"}`}>
          {typeof children === "function" ? children(() => setOpen(false)) : children}
        </div>
      )}
    </div>
  );
}

export function DropdownItem({ icon: Icon, danger, children, ...props }) {
  return (
    <button
      type="button" role="menuitem"
      className={`flex w-full items-center gap-2.5 px-4 py-2 text-left text-sm hover:bg-paper ${danger ? "text-clay-600" : "text-ink"}`}
      {...props}
    >
      {Icon && <Icon className="size-4 opacity-70" />}{children}
    </button>
  );
}

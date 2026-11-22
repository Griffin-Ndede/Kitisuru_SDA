import React from "react";
import { CircleAlert, Inbox } from "lucide-react";

export function EmptyState({ icon: Icon = Inbox, title, children, action }) {
  return (
    <div className="flex flex-col items-center px-6 py-12 text-center">
      <span className="arch grid h-16 w-14 place-items-center bg-forest-50 text-forest-600"><Icon className="size-6" /></span>
      <h3 className="mt-4 text-lg font-semibold">{title}</h3>
      {children && <p className="mt-1 max-w-sm text-sm text-muted">{children}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

// A banner for an error next to a form.
export function FormError({ children }) {
  if (!children) return null;
  return (
    <p role="alert" className="flex items-start gap-2 rounded-xl bg-clay-100 px-3.5 py-2.5 text-sm text-clay-700">
      <CircleAlert className="mt-0.5 size-4 shrink-0" />{children}
    </p>
  );
}

// A notice with an icon: used for "complete your profile", "waiting for approval" and similar.
export function Notice({ icon: Icon, title, tone = "info", children }) {
  const tones = {
    info: "border-forest-100 bg-forest-50 text-forest-900",
    warm: "border-marigold-100 bg-marigold-100/60 text-ink",
  };
  return (
    <div role="status" className={`mb-6 flex gap-4 rounded-card border p-5 ${tones[tone]}`}>
      {Icon && <span className="grid size-10 shrink-0 place-items-center rounded-full bg-white text-forest-700"><Icon className="size-5" /></span>}
      <div>
        <h2 className="font-display text-lg font-semibold">{title}</h2>
        <div className="mt-0.5 text-sm text-muted">{children}</div>
      </div>
    </div>
  );
}

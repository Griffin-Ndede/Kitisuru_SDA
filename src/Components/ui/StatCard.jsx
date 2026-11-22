import React from "react";
import Card from "./Card";

export default function StatCard({ icon: Icon, label, value, hint }) {
  return (
    <Card>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-muted">{label}</p>
          <p className="mt-1 font-display text-3xl font-semibold">{value}</p>
          {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
        </div>
        {Icon && <span className="grid size-10 place-items-center rounded-full bg-forest-50 text-forest-700"><Icon className="size-5" /></span>}
      </div>
    </Card>
  );
}

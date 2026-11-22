import React from "react";
import { LoaderCircle } from "lucide-react";

export default function Spinner({ label = "Loading" }) {
  return (
    <div role="status" className="flex items-center justify-center gap-2 py-12 text-muted">
      <LoaderCircle className="size-5 animate-spin" /> <span className="text-sm">{label}</span>
    </div>
  );
}

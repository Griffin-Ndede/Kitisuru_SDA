import React, { useState } from "react";
import { Check, Copy, CircleAlert } from "lucide-react";

// A read-only link with a Copy button. Used for invitation links and the shared sign-up link.
export default function CopyLink({ link, children }) {
  const [copied, setCopied] = useState(false);
  const [failed, setFailed] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setFailed(false);
    } catch {
      setFailed(true);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <input
          readOnly
          value={link}
          onFocus={(e) => e.target.select()}
          aria-label="Link"
          className="input min-w-60 flex-1"
        />
        <button
          type="button"
          className="inline-flex items-center justify-center gap-2 rounded-full font-semibold transition active:translate-y-px disabled:opacity-60 bg-forest-900 text-paper hover:bg-forest-800 shadow-card px-3 py-1.5 text-sm"
          onClick={copy}
        >
          {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
          {copied ? "Copied" : "Copy link"}
        </button>
        {children}
      </div>
      {failed && (
        <div className="mt-2">
          <p role="alert" className="flex items-start gap-2 rounded-xl bg-clay-100 px-3.5 py-2.5 text-sm text-clay-700">
            <CircleAlert className="mt-0.5 size-4 shrink-0" />
            Could not copy. Select the link and copy it by hand.
          </p>
        </div>
      )}
    </div>
  );
}

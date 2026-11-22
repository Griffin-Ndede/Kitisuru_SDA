import React, { useState } from "react";
import { Check, Copy } from "lucide-react";
import Button from "../../Components/ui/Button";
import { FormError } from "../../Components/ui/States";

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
        <input readOnly value={link} onFocus={(e) => e.target.select()} aria-label="Link"
          className="input min-w-60 flex-1" />
        <Button size="sm" icon={copied ? Check : Copy} onClick={copy}>{copied ? "Copied" : "Copy link"}</Button>
        {children}
      </div>
      {failed && <div className="mt-2"><FormError>Could not copy. Select the link and copy it by hand.</FormError></div>}
    </div>
  );
}

import React, { useState } from "react";

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
          className="flex-1 min-w-60 border border-gray-300 rounded px-3 py-2 bg-white" />
        <button type="button" onClick={copy}
          className="px-4 py-2 rounded-full bg-custom-blue text-white cursor-pointer">
          {copied ? "Copied" : "Copy link"}
        </button>
        {children}
      </div>
      {failed && <p role="alert" className="text-red-600 text-sm mt-2">Could not copy. Select the link and copy it by hand.</p>}
    </div>
  );
}

import React, { useEffect } from "react";

// A centred box over a dimmed page. Escape or a click outside closes it.
export default function Modal({ title, onClose, children }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 bg-black/40 overflow-y-auto p-4" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div role="dialog" aria-modal="true" aria-label={title} className="bg-white rounded-2xl max-w-2xl mx-auto my-8 p-6">
        <h2 className="text-xl font-extrabold text-custom-blue mb-4">{title}</h2>
        {children}
      </div>
    </div>
  );
}

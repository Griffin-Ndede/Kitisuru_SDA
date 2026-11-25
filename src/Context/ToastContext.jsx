import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import { CircleCheck, CircleAlert, X } from "lucide-react";

const ToastContext = createContext(null);

// Short messages that fade out by themselves: "Saved", "Member removed" and so on.
// Errors next to a form stay inline; toasts are for things that worked.
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => setToasts((all) => all.filter((t) => t.id !== id)), []);

  const show = useCallback((message, tone = "success") => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((all) => [...all, { id, message, tone }]);
    setTimeout(() => dismiss(id), 4500);
  }, [dismiss]);

  const api = useMemo(() => ({
    success: (message) => show(message, "success"),
    error: (message) => show(message, "error"),
  }), [show]);

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div aria-live="polite" className="app-theme pointer-events-none fixed inset-x-0 bottom-4 z-[60] flex flex-col items-center gap-2 bg-transparent px-4">
        {toasts.map(({ id, message, tone }) => (
          <div key={id} className="rise pointer-events-auto flex max-w-md items-center gap-3 rounded-full bg-forest-950 py-2.5 pr-3 pl-4 text-sm text-paper shadow-lift">
            {tone === "error" ? <CircleAlert className="size-4 text-marigold-400" /> : <CircleCheck className="size-4 text-marigold-400" />}
            <span>{message}</span>
            <button type="button" onClick={() => dismiss(id)} aria-label="Dismiss" className="rounded-full p-1 hover:bg-white/10"><X className="size-3.5" /></button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useToast = () => useContext(ToastContext);

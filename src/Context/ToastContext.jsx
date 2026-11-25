import React, { createContext, useContext, useMemo } from "react";
import Swal from "sweetalert2";

const ToastContext = createContext(null);

// A small SweetAlert message that closes by itself: "Saved", "Member removed" and so on.
// Pages still call toast.success("...") or toast.error("..."). Errors next to a form stay
// inline; toasts are for things that worked. Colours: the dashboard's dark blue with
// the website's yellow icon.
const Toast = Swal.mixin({
  toast: true,
  position: "bottom",
  showConfirmButton: false,
  showCloseButton: true,
  timer: 4500,
  timerProgressBar: true,
  background: "#0f3447", // forest-950
  color: "#f9fafb", // paper
  iconColor: "#ffd633", // marigold-400
  didOpen: (toast) => {
    // Pause the timer while the mouse is over it
    toast.addEventListener("mouseenter", Swal.stopTimer);
    toast.addEventListener("mouseleave", Swal.resumeTimer);
  },
});

export function ToastProvider({ children }) {
  const api = useMemo(
    () => ({
      success: (message) => Toast.fire({ icon: "success", title: message }),
      error: (message) => Toast.fire({ icon: "error", title: message }),
    }),
    [],
  );
  return <ToastContext.Provider value={api}>{children}</ToastContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export const useToast = () => useContext(ToastContext);

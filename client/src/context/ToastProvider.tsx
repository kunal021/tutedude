import Toast, { ToastPosition } from "@/components/ui/toast";
import React, { createContext, useState, useCallback } from "react";

type ToastType = "success" | "error";

interface ToastContextType {
  showToast: (
    type: ToastType,
    message: string,
    position: ToastPosition,
    duration?: number
  ) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toast, setToast] = useState<{
    type: ToastType;
    message: string;
    position: ToastPosition;
    duration?: number;
  } | null>(null);

  const showToast = useCallback(
    (
      type: ToastType,
      message: string,
      position: ToastPosition,
      duration?: number
    ) => {
      setToast({ type, message, position, duration });
    },
    []
  );

  const handleClose = useCallback(() => {
    setToast(null);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          position={toast.position}
          duration={toast.duration}
          onClose={handleClose}
        />
      )}
    </ToastContext.Provider>
  );
};

export default ToastContext;

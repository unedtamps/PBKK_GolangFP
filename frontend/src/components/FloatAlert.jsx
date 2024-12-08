import React, { useEffect } from "react";
import { Alert } from "./ui/alert";

export const FloatingAlert = ({ message, onClose, status, title, duration = 5000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer); // Bersihkan timer saat komponen di-unmount
  }, [onClose, duration]);

  return (
    <>
      <div className="floating-alert bg-white shadow-lg border border-gray-300">
        <Alert status={status} title={title}>
          {message}
        </Alert>
      </div>
    </>
  );
};

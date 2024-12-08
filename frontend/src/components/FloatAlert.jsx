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
      <Alert status={status} title={title}>
        {message}
      </Alert>
    </>
  );
};

import "./Modal.css";
import { ModalProps } from "./Modal.types";
import { useEffect } from "react";

export const Modal = ({ isOpen, title, children, onClose }: ModalProps) => {
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={onClose}
    >
      <div
        className="modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <h2 id="modal-title" className="modal-title">
            {title}
          </h2>
        )}

        <div className="modal-content">{children}</div>

        <button className="modal-close">
  <span aria-hidden="true">✕</span>
  <span className="sr-only">Close modal</span>
</button>

      </div>
    </div>
  );
};

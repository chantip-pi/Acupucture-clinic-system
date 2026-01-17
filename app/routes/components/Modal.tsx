import React, { useEffect, ReactNode } from "react";
import ReactDOM from "react-dom";
import { CSSTransition } from "react-transition-group";
import "./Modal.css";

interface ModalProps {
  show: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
  onAdd: () => void;
  addButtonText?: string;
}

const Modal: React.FC<ModalProps> = ({
  show,
  title,
  children,
  onClose,
  onAdd,
  addButtonText = "Add",
}) => {
  const closeOnEscapeKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
    }
  };

  useEffect(() => {
    document.body.addEventListener("keydown", closeOnEscapeKeyDown);
    return () => {
      document.body.removeEventListener("keydown", closeOnEscapeKeyDown);
    };
  }, [onClose]);

  const portalRoot =
    typeof document !== "undefined"
      ? document.getElementById("modal-root")
      : null;

  if (!portalRoot) return null;

  return ReactDOM.createPortal(
    <CSSTransition
      in={show}
      unmountOnExit
      timeout={{ enter: 300, exit: 300 }}
      classNames="modal"
    >
      <div className="modal" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h4 className="modal-title">{title}</h4>
          </div>

          <div className="modal-body">{children}</div>

          <div className="modal-footer">
            <button onClick={onAdd} className="button">
              {addButtonText}
            </button>
            <button onClick={onClose} className="button">
              Close
            </button>
          </div>
        </div>
      </div>
    </CSSTransition>,
    portalRoot
  );
};

export default Modal;

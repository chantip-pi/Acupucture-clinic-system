import React, { useEffect, ReactNode } from "react";
import {
  Modal as DesignSystemModal,
  ModalHeader,
  ModalTitle,
  ModalBody,
  ModalFooter,
  Button,
} from "~/presentation/designSystem";

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

  return (
    <DesignSystemModal isOpen={show} onClose={onClose}>
      <ModalHeader>
        <ModalTitle>{title}</ModalTitle>
      </ModalHeader>
      
      <ModalBody>{children}</ModalBody>
      
      <ModalFooter>
        <Button variant="primary" onClick={onAdd} type="button">
          {addButtonText}
        </Button>
        <Button variant="secondary" onClick={onClose} type="button">
          Close
        </Button>
      </ModalFooter>
    </DesignSystemModal>
  );
};

export default Modal;

import { Modal as BsModal } from 'react-bootstrap'

export default function Modal({ isOpen, onClose, title, children, size = 'md' }) {
  return (
    <BsModal show={isOpen} onHide={onClose} size={size} centered backdrop="static">
      {title && (
        <BsModal.Header closeButton>
          <BsModal.Title className="fs-5 fw-bold">{title}</BsModal.Title>
        </BsModal.Header>
      )}
      <BsModal.Body className="p-4">{children}</BsModal.Body>
    </BsModal>
  )
}

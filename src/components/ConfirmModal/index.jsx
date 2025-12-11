import { AlertTriangle } from 'lucide-react';
import './ConfirmModal.css';

function ConfirmModal({ isOpen, onClose, onConfirm, title, message, confirmText = 'Delete', cancelText = 'Cancel', isLoading = false }) {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <div className="confirm-modal-overlay" onClick={onClose}>
      <div className="confirm-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="confirm-modal-icon">
          <AlertTriangle size={48} />
        </div>

        <div className="confirm-modal-body">
          <h2 className="confirm-modal-title">{title}</h2>
          <p className="confirm-modal-message">{message}</p>
        </div>

        <div className="confirm-modal-actions">
          <button
            onClick={onClose}
            className="btn btn-secondary"
            disabled={isLoading}
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            className="btn btn-danger"
            disabled={isLoading}
          >
            {isLoading ? 'Deleting...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;

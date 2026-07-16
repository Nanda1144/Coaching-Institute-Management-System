import './SuccessNotification.css';

export default function SuccessNotification({ show, onClose }) {
  if (!show) return null;

  return (
    <div className="notification-overlay">
      <div className="notification-card">
        <div className="notification-icon">✅</div>
        <h2 className="notification-title">Batch Created!</h2>
        <p className="notification-message">
          The batch has been successfully created and is now active in the system.
        </p>
        <button className="notification-btn" onClick={onClose}>OK</button>
      </div>
    </div>
  );
}

import './LoadingState.css';

export default function LoadingState({ message = 'Loading batches...' }) {
  return (
    <div className="loading-state">
      <div className="spinner"></div>
      <p>{message}</p>
    </div>
  );
}

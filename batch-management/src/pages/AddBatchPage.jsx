import Header from '../components/Header';
import BatchForm from '../components/BatchForm';

export default function AddBatchPage({ onNavigate, onBatchCreated }) {
  return (
    <div className="page">
      <Header title="Add Batch" subtitle="Create a new batch for the institute" />
      <div className="content-area form-page">
        <BatchForm onBatchCreated={onBatchCreated} />
      </div>
    </div>
  );
}

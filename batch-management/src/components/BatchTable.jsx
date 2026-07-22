import StatusBadge from './StatusBadge';
import './BatchTable.css';

export default function BatchTable({ batches }) {
  if (batches.length === 0) return null;

  return (
    <div className="table-wrapper">
      <table className="batch-table">
        <thead>
          <tr>
            <th>Batch ID</th>
            <th>Batch Name</th>
            <th>Course</th>
            <th>Faculty</th>
            <th>Schedule</th>
            <th>Classroom</th>
            <th>Students</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {batches.map((batch) => (
            <tr key={batch.id}>
              <td className="cell-id">{batch.id}</td>
              <td className="cell-name">{batch.name}</td>
              <td>{batch.course}</td>
              <td>{batch.faculty}</td>
              <td className="cell-schedule">{batch.schedule}</td>
              <td>{batch.classroom}</td>
              <td className="cell-students">
                <span className="student-count">{batch.students}</span>
              </td>
              <td><StatusBadge status={batch.status} /></td>
              <td>
                <div className="action-btns">
                  <button className="action-btn view" title="View">👁</button>
                  <button className="action-btn edit" title="Edit">✏️</button>
                  <button className="action-btn delete" title="Delete">🗑</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

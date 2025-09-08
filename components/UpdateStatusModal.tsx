import React, { useState } from 'react';

interface UpdateStatusModalProps {
  project: any;
  onClose: () => void;
  onUpdate: (projectId: string, newStatus: string) => void;
}

const UpdateStatusModal: React.FC<UpdateStatusModalProps> = ({ project, onClose, onUpdate }) => {
  const [selectedStatus, setSelectedStatus] = useState(project?.status || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(project.id, selectedStatus);
  };

  const statusOptions = [
    { value: 'PLANNING', label: 'Planning', color: 'blue' },
    { value: 'IN-PROGRESS', label: 'In Progress', color: 'yellow' },
    { value: 'REVIEW', label: 'Review', color: 'purple' },
    { value: 'COMPLETED', label: 'Completed', color: 'green' },
    { value: 'ON-HOLD', label: 'On Hold', color: 'gray' },
    { value: 'CANCELLED', label: 'Cancelled', color: 'red' }
  ];

  if (!project) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Update Project Status</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Project</label>
            <div className="project-info">
              <h4>{project.name}</h4>
              <p>Client: {project.client}</p>
            </div>
          </div>

          <div className="form-group">
            <label>Current Status</label>
            <div className="current-status">
              <span className={`status-badge status-${project.status?.toLowerCase()}`}>
                {project.status}
              </span>
            </div>
          </div>

          <div className="form-group">
            <label>New Status</label>
            <div className="status-options">
              {statusOptions.map(option => (
                <label key={option.value} className="status-option">
                  <input
                    type="radio"
                    name="status"
                    value={option.value}
                    checked={selectedStatus === option.value}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                  />
                  <span className={`status-badge status-${option.color}`}>
                    {option.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-outline" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Update Status
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateStatusModal;



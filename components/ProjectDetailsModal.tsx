import React from 'react';

interface ProjectDetailsModalProps {
  project: any;
  onClose: () => void;
}

const ProjectDetailsModal: React.FC<ProjectDetailsModalProps> = ({ project, onClose }) => {
  if (!project) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal project-details-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Project Details</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        
        <div className="project-details-content">
          <div className="project-info-section">
            <h3>{project.name}</h3>
            <div className="project-meta">
              <div className="meta-item">
                <span className="meta-label">Status:</span>
                <span className={`status-badge status-${project.status?.toLowerCase()}`}>
                  {project.status}
                </span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Client:</span>
                <span className="meta-value">{project.client}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Due Date:</span>
                <span className="meta-value">{project.dueDate}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Priority:</span>
                <span className={`priority-badge priority-${project.priority?.toLowerCase()}`}>
                  {project.priority}
                </span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Created:</span>
                <span className="meta-value">{project.created || 'N/A'}</span>
              </div>
            </div>
          </div>

          {project.description && (
            <div className="project-description-section">
              <h4>Description</h4>
              <p>{project.description}</p>
            </div>
          )}

          <div className="project-milestones-section">
            <h4>Milestones</h4>
            <div className="milestones-list">
              {project.milestones && project.milestones.length > 0 ? (
                project.milestones.map((milestone: any, index: number) => (
                  <div key={index} className="milestone-item">
                    <div className="milestone-checkbox">
                      <input type="checkbox" checked={milestone.completed} readOnly />
                    </div>
                    <div className="milestone-content">
                      <div className="milestone-title">{milestone.title}</div>
                      <div className="milestone-date">{milestone.dueDate}</div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="no-milestones">No milestones added yet.</p>
              )}
            </div>
          </div>

          <div className="project-files-section">
            <h4>Files & Documents</h4>
            <div className="files-list">
              {project.files && project.files.length > 0 ? (
                project.files.map((file: any, index: number) => (
                  <div key={index} className="file-item">
                    <div className="file-icon">📄</div>
                    <div className="file-info">
                      <div className="file-name">{file.name}</div>
                      <div className="file-size">{file.size}</div>
                    </div>
                    <button className="btn btn-outline btn-sm">Download</button>
                  </div>
                ))
              ) : (
                <p className="no-files">No files uploaded yet.</p>
              )}
            </div>
          </div>
        </div>

        <div className="modal-actions">
          <button className="btn btn-outline" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailsModal;



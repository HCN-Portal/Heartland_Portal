import React, { useState } from "react";
import ProjectDetailsModal from "./ProjectDetailsModal";
import "./AdminProjects.css";

const sampleProjects = [
  {
    id: 1,
    name: "Project Alpha",
    description: "This is a detailed description for Project Alpha...",
    status: "Active",
    managers: ["Alice", "Bob"],
    employees: ["Charlie", "David", "Eva"],
    applications: ["App A", "App B"],
  },
  {
    id: 2,
    name: "Project Beta",
    description: "Project Beta focuses on backend development...",
    status: "Inactive",
    managers: ["Frank"],
    employees: ["George", "Helen"],
    applications: ["App C"],
  },
  // Add more sample projects if needed
];

const STATUS_OPTIONS = ["All", "Active", "Inactive"];

export default function AdminProjects() {
  const [projects, setProjects] = useState(sampleProjects);
  const [filterStatus, setFilterStatus] = useState("All");

  // Modal States
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [viewProject, setViewProject] = useState(null);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newProjectData, setNewProjectData] = useState({
    name: "",
    description: "",
    status: "Active",
    managers: [],
    employees: [],
    applications: [],
  });

  // Filter projects by status
  const filteredProjects =
    filterStatus === "All"
      ? projects
      : projects.filter((p) => p.status === filterStatus);

  // Handlers for View Modal
  function openView(project) {
    setViewProject(project);
    setIsViewOpen(true);
  }
  function closeView() {
    setIsViewOpen(false);
    setViewProject(null);
  }

  // Handlers for Create Modal
  function openCreate() {
    setNewProjectData({
      name: "",
      description: "",
      status: "Active",
      managers: [],
      employees: [],
      applications: [],
    });
    setIsCreateOpen(true);
  }
  function closeCreate() {
    setIsCreateOpen(false);
  }
  function handleCreateChange(e) {
    const { name, value } = e.target;
    setNewProjectData((prev) => ({ ...prev, [name]: value }));
  }
  function saveCreate() {
    const newProj = {
      ...newProjectData,
      id: Date.now(),
    };
    setProjects((prev) => [newProj, ...prev]);
    closeCreate();
  }

  // Delete Project
  function deleteProject(id) {
    if (window.confirm("Are you sure you want to delete this project?")) {
      setProjects((prev) => prev.filter((p) => p.id !== id));
    }
  }

  return (
    <div className="admin-projects">
      <h2 className="projects-title">Admin Projects</h2>

      <div className="top-controls">
        <select
          className="status-filter"
          aria-label="Filter projects by status"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>

        <button
          className="create-btn"
          onClick={openCreate}
          aria-label="Create new project"
        >
          + Create Project
        </button>
      </div>

      <table className="project-table" role="table" aria-label="Projects List">
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredProjects.length === 0 && (
            <tr>
              <td colSpan="4" style={{ textAlign: "center", padding: "20px" }}>
                No projects found.
              </td>
            </tr>
          )}

          {filteredProjects.map((project) => (
            <tr key={project.id}>
              <td>{project.name}</td>
              <td title={project.description}>
                {project.description.length > 60
                  ? project.description.slice(0, 57) + "..."
                  : project.description}
              </td>
              <td>{project.status}</td>
              <td className="actions-col">
                <button
                  className="view-btn"
                  onClick={() => openView(project)}
                  aria-label={`View details of ${project.name}`}
                >
                  View
                </button>
                <button
                  className="delete-btn"
                  onClick={() => deleteProject(project.id)}
                  aria-label={`Delete ${project.name}`}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Create Modal */}
      {isCreateOpen && (
        <div
          className="modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="create-project-title"
          onClick={(e) => e.target === e.currentTarget && closeCreate()}
        >
          <div className="modal-content" tabIndex={-1}>
            <h3 id="create-project-title" style={{ color: "#5C98B8" }}>
              Create New Project
            </h3>
            <label htmlFor="create-name">Name</label>
            <input
              id="create-name"
              name="name"
              type="text"
              value={newProjectData.name}
              onChange={handleCreateChange}
              autoFocus
            />
            <label htmlFor="create-description">Description</label>
            <textarea
              id="create-description"
              name="description"
              value={newProjectData.description}
              onChange={handleCreateChange}
            />
            <label htmlFor="create-status">Status</label>
            <select
              id="create-status"
              name="status"
              value={newProjectData.status}
              onChange={handleCreateChange}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>

            <div className="modal-buttons">
              <button className="close-btn" onClick={closeCreate}>
                Cancel
              </button>
              <button
                className="create-btn"
                onClick={saveCreate}
                disabled={!newProjectData.name.trim()}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Details Modal */}
      {isViewOpen && viewProject && (
        <ProjectDetailsModal project={viewProject} onClose={closeView} />
      )}
    </div>
  );
}

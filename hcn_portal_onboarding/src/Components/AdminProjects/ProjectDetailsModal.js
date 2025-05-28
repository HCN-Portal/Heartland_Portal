import React, { useState } from "react";
import "./ProjectDetailsModal.css";

const Tab = ({ name, active, onClick }) => (
  <button
    className={`tab ${active ? "active" : ""}`}
    onClick={() => onClick(name)}
  >
    {name}
  </button>
);

const ListSection = ({
  title,
  data,
  fields,
  onAddItem,
  onRemoveItem
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newItem, setNewItem] = useState(() =>
    fields.reduce((acc, f) => ({ ...acc, [f]: "" }), {})
  );

  const handleNewChange = (field, value) => {
    setNewItem(prev => ({ ...prev, [field]: value }));
  };

  const handleAdd = () => {
    // Validate: all fields non-empty
    const allFilled = fields.every(f => newItem[f] && newItem[f].trim() !== "");
    if (!allFilled) {
      alert("Please fill all fields before adding.");
      return;
    }
    onAddItem(newItem);
    setNewItem(fields.reduce((acc, f) => ({ ...acc, [f]: "" }), {}));
    setIsAdding(false);
  };

  return (
    <div className="section">
      <h3>{title}</h3>

      {data.length === 0 && <p>No {title.toLowerCase()} assigned.</p>}

      {data.map((item, idx) => (
        <div key={idx} className="form-row">
          {fields.map(field => (
            <input
              key={field}
              value={item[field]}
              disabled
              className="readonly-input"
            />
          ))}
          <button
            className="remove-btn"
            onClick={() => onRemoveItem(idx)}
            title={`Remove ${title.slice(0, -1)}`}
          >
            ✕
          </button>
        </div>
      ))}

      {isAdding ? (
        <div className="form-row">
          {fields.map(field => (
            <input
              key={field}
              placeholder={`New ${field}`}
              value={newItem[field]}
              onChange={e => handleNewChange(field, e.target.value)}
            />
          ))}
          <button className="add-btn" onClick={handleAdd}>+ Add</button>
          <button className="cancel-btn" onClick={() => { setIsAdding(false); setNewItem(fields.reduce((acc, f) => ({ ...acc, [f]: "" }), {})); }}>
            Cancel
          </button>
        </div>
      ) : (
        <button className="add-new-btn" onClick={() => setIsAdding(true)}>+ Add {title.slice(0, -1)}</button>
      )}
    </div>
  );
};

export default function ProjectDetailsModal({ project, onClose, onSave }) {
  const [tab, setTab] = useState("Overview");
  const [form, setForm] = useState({ ...project });

  const handleOverviewChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleAddItem = (key, item) => {
    setForm(prev => ({ ...prev, [key]: [...prev[key], item] }));
  };

  const handleRemoveItem = (key, index) => {
    setForm(prev => ({ ...prev, [key]: prev[key].filter((_, i) => i !== index) }));
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h2>Edit Project</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="tabs">
          {["Overview", "Managers", "Employees", "Applications"].map(name => (
            <Tab key={name} name={name} active={tab === name} onClick={setTab} />
          ))}
        </div>

        <div className="tab-content">
          {tab === "Overview" && (
            <div className="overview-edit">
              <label>
                Name:
                <input
                  type="text"
                  value={form.name}
                  onChange={e => handleOverviewChange("name", e.target.value)}
                />
              </label>
              <label>
                Description:
                <textarea
                  value={form.description}
                  onChange={e => handleOverviewChange("description", e.target.value)}
                />
              </label>
              <label>
                Status:
                <select
                  value={form.status}
                  onChange={e => handleOverviewChange("status", e.target.value)}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </label>
            </div>
          )}

          {tab === "Managers" && (
            <ListSection
              title="Managers"
              data={form.managers}
              fields={["name", "email", "phone"]}
              onAddItem={(item) => handleAddItem("managers", item)}
              onRemoveItem={(idx) => handleRemoveItem("managers", idx)}
            />
          )}

          {tab === "Employees" && (
            <ListSection
              title="Employees"
              data={form.employees}
              fields={["name", "email", "phone"]}
              onAddItem={(item) => handleAddItem("employees", item)}
              onRemoveItem={(idx) => handleRemoveItem("employees", idx)}
            />
          )}

          {tab === "Applications" && (
            <ListSection
              title="Applications"
              data={form.applications}
              fields={["employee", "status"]}
              onAddItem={(item) => handleAddItem("applications", item)}
              onRemoveItem={(idx) => handleRemoveItem("applications", idx)}
            />
          )}
        </div>

        <div className="modal-footer">
          <button className="btn" onClick={onClose}>Cancel</button>
          <button className="btn primary" onClick={() => onSave(form)}>Save</button>
        </div>
      </div>
    </div>
  );
}

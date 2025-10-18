import React, { useState, useEffect } from "react";

export default function EditAssignmentModal({
  show,
  handleClose,
  assignment,
  modules = [],
  categories = [],
  onModified, // callback after edit
}) {
  const [title, setTitle] = useState("");
  const [moduleID, setModuleID] = useState("");
  const [categoryID, setCategoryID] = useState("");
  const [maxScore, setMaxScore] = useState("");
  const [dueDate, setDueDate] = useState("");

  useEffect(() => {
    if (assignment) {
      setTitle(assignment.title ?? assignment.name ?? "");
      setModuleID(assignment.unit_id ?? assignment.module_id ?? "");
      setCategoryID(assignment.category_id ?? "");
      setMaxScore(assignment.max_score ?? "");
      setDueDate(assignment.due_date ?? "");
    }
  }, [assignment]);

  const handleSave = async () => {
    try {
      await window.api.updateAssignment(
        assignment.id,
        assignment.subject_id,
        moduleID,
        categoryID,
        title,
        Number(maxScore),
        dueDate || null,
      );
      if (onModified) onModified();
      handleClose();
    } catch (err) {
      console.error("Error updating assignment:", err);
      alert("Failed to update assignment. Check console for details.");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this assignment?")) return;

    try {
      await window.api.deleteAssignment(assignment.id);
      if (onModified) onModified();
      handleClose();
    } catch (err) {
      console.error("Error deleting assignment:", err);
      alert("Failed to delete assignment. Check console for details.");
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
        <h2 className="text-xl font-bold mb-4">Edit Assignment</h2>

        {/* Title */}
        <div className="mb-3">
          <label className="block font-semibold mb-1">Title</label>
          <input
            type="text"
            className="border rounded px-2 py-1 w-full"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* Module / Unit */}
        <div className="mb-3">
          <label className="block font-semibold mb-1">Module</label>
          <select
            className="border rounded px-2 py-1 w-full"
            value={moduleID}
            onChange={(e) => setModuleID(e.target.value)}
          >
            {modules.map((mod) => (
              <option key={mod.id} value={mod.id}>
                {mod.name}
              </option>
            ))}
          </select>
        </div>

        {/* Category */}
        <div className="mb-3">
          <label className="block font-semibold mb-1">Category</label>
          <select
            className="border rounded px-2 py-1 w-full"
            value={categoryID}
            onChange={(e) => setCategoryID(e.target.value)}
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Max Score */}
        <div className="mb-3">
          <label className="block font-semibold mb-1">Max Score</label>
          <input
            type="number"
            className="border rounded px-2 py-1 w-full"
            value={maxScore}
            onChange={(e) => setMaxScore(e.target.value)}
          />
        </div>

        {/* Due Date */}
        <div className="mb-3">
          <label className="block font-semibold mb-1">Due Date</label>
          <input
            type="date"
            className="border rounded px-2 py-1 w-full"
            value={dueDate ? dueDate.split("T")[0] : ""}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-between mt-4">
          <button
            onClick={handleDelete}
            className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
          >
            Delete
          </button>

          <div className="flex gap-2">
            <button
              onClick={handleClose}
              className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

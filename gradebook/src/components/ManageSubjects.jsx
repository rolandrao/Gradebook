import React, { useState, useEffect } from "react";
import EditSubjectModal from "../components/EditSubjectModal";

export default function Subjects() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [editingSubject, setEditingSubject] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const [newSubjectName, setNewSubjectName] = useState("");

  // Fetch all subjects
  const fetchSubjects = async () => {
    try {
      setLoading(true);
      const result = await window.api.getSubjects();
      setSubjects(result);
    } catch (err) {
      console.error("Failed to fetch subjects:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  // Add subject
  const handleAddSubject = async () => {
    if (!newSubjectName.trim()) return;
    try {
      await window.api.addSubject(newSubjectName.trim());
      setNewSubjectName("");
      fetchSubjects();
    } catch (err) {
      console.error("Failed to add subject:", err);
    }
  };

  // Delete subject
  const handleDeleteSubject = async (id) => {
    if (!window.confirm("Are you sure you want to delete this subject?")) return;
    try {
      await window.api.deleteSubject(id);
      fetchSubjects();
    } catch (err) {
      console.error("Failed to delete subject:", err);
    }
  };

  const handleEditClick = (subject) => {
    setEditingSubject(subject);
    setShowEditModal(true);
  };

  const handleModalClose = () => {
    setShowEditModal(false);
    setEditingSubject(null);
    fetchSubjects(); // Refresh subjects after editing
  };

  if (loading) return <p>Loading subjects...</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Subjects</h1>

      {/* Add Subject */}
      <div className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="New Subject Name"
          value={newSubjectName}
          onChange={(e) => setNewSubjectName(e.target.value)}
          className="border rounded px-3 py-2 flex-1"
        />
        <button
          onClick={handleAddSubject}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Add Subject
        </button>
      </div>

      <table className="table-auto border-collapse border border-gray-400 w-full">
        <thead>
          <tr>
            <th className="border px-4 py-2">ID</th>
            <th className="border px-4 py-2">Subject Name</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {subjects.map((subject) => (
            <tr key={subject.id}>
              <td className="border px-4 py-2">{subject.id}</td>
              <td className="border px-4 py-2">{subject.name}</td>
              <td className="border px-4 py-2 flex gap-2">
                <button
                  onClick={() => handleEditClick(subject)}
                  className="px-2 py-1 bg-yellow-400 rounded hover:bg-yellow-500"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteSubject(subject.id)}
                  className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Edit Subject Modal */}
      {editingSubject && (
        <EditSubjectModal
          subject={editingSubject}
          show={showEditModal}
          handleClose={handleModalClose}
        />
      )}
    </div>
  );
}

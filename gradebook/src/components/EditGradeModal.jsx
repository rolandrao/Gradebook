import React, { useState, useEffect } from "react";

export default function EditGradeModal({ grade, onClose, onSaved }) {
  const [points, setPoints] = useState(grade.currentGrade ?? "");


  const handleSave = async () => {
    try {
      await window.api.updateGrade(
        grade.studentID,
        grade.assignmentID,
        points === "" ? null : Number(points),
      );
      onSaved(); // tell parent (Subject.jsx) to refresh
    } catch (error) {
      console.error("Error saving grade:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
        <h2 className="text-xl font-bold mb-4">Edit Grade</h2>

        <input
          type="number"
          value={points}
          onChange={(e) => setPoints(e.target.value)}
          placeholder="Enter points"
          className="border rounded-lg px-3 py-2 w-full mb-4"
        />

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
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
  );
}

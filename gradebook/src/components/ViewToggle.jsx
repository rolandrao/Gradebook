import { useState } from "react";

export default function ViewToggle({ viewMode, setViewMode }) {
  const isAssignment = viewMode === true

  return (
    <div className="flex items-center gap-3 mt-4">
      <span className="text-sm font-medium text-gray-700">Assignment View</span>

      <button
        type="button"
        onClick={() => setViewMode(!isAssignment)}
        className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors duration-300 focus:outline-none ${
          isAssignment ? "bg-blue-600" : "bg-gray-300"
        }`}
      >
        <span
          className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform duration-300 ${
            isAssignment ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>

      <span className="text-sm font-medium text-gray-700">Unit View</span>
    </div>
  );
}

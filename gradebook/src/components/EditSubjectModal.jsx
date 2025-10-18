import React, { useState, useEffect } from "react";
import EntityManager from "./EntityManager";

export default function EditSubjectModal({ subject, show, handleClose }) {
  if (!subject) return null;

  return (
    <div
      className={`fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center ${
        show ? "block" : "hidden"
      }`}
    >
      <div className="bg-white rounded-lg p-6 w-11/12 max-w-8xl shadow-lg overflow-y-auto max-h-[90vh]">
        <h2 className="text-xl font-bold mb-4">Edit Subject: {subject.name}</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Modules / Units Table */}
          <div>
            <h3 className="font-semibold mb-2">Modules / Units</h3>
            <EntityManager
              entityName="module"
              fetchData={() => window.api.getUnits(subject.id)}
              createItem={(data) => window.api.addUnit(subject.id, data.name)}
              updateItem={(id, data) => window.api.updateUnit(id, data.name)}
              deleteItem={(id) => window.api.deleteUnit(id)}
              columns={[
                { key: "id", label: "ID" },
                { key: "name", label: "Module Name" },
              ]}
            />
          </div>

          {/* Categories Table */}
          <div>
            <h3 className="font-semibold mb-2">Categories</h3>
            <EntityManager
              entityName="category"
              fetchData={() => window.api.getCategories(subject.id)}
              createItem={(data) =>
                window.api.addCategory(subject.id, data.name, data.weight)
              }
              updateItem={(id, data) =>
                window.api.updateCategory(id, data.name, data.weight)
              }
              deleteItem={(id) => window.api.deleteCategory(id)}
              columns={[
                { key: "id", label: "ID" },
                { key: "name", label: "Category Name" },
                { key: "weight", label: "Weight" },
              ]}
            />
          </div>
        </div>

        <div className="flex justify-end mt-4">
          <button
            onClick={handleClose}
            className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

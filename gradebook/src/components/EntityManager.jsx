import React, { useState, useEffect } from "react";

export default function EntityManager({ entityName, columns, fetchData, createRow, updateRow, deleteRow }) {
  const [rows, setRows] = useState([]);
  const [newRow, setNewRow] = useState({});

  // Load rows
  const loadRows = async () => {
    try {
      const data = await fetchData();
      setRows(data);
    } catch (err) {
      console.error(`Failed to load ${entityName}:`, err);
    }
  };

  useEffect(() => {
    loadRows();
  }, []);

  // Handle add row
  const handleAddRow = async () => {
    try {
      console.log('Adding row:', newRow);
      await createRow(newRow);
      setNewRow({});
      loadRows();
    } catch (err) {
      console.error(`Failed to add ${entityName}:`, err);
    }
  };

  // Handle update row
  const handleUpdateRow = async (id, updatedRow) => {
    try {
      await updateRow(id, updatedRow);
      loadRows();
    } catch (err) {
      console.error(`Failed to update ${entityName}:`, err);
    }
  };

  // Handle delete row
  const handleDeleteRow = async (id) => {
    if (!window.confirm(`Are you sure you want to delete this ${entityName}?`)) return;
    try {
      await deleteRow(id);
      loadRows();
    } catch (err) {
      console.error(`Failed to delete ${entityName}:`, err);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="table-auto border-collapse border border-gray-300 w-full">
        <thead className="bg-gray-100">
          <tr>
            {columns.map((col) =>
              col.key === "id" ? null : (
                <th key={col.key} className="border px-4 py-2 text-left">
                  {col.label}
                </th>
              )
            )}
            <th className="border px-4 py-2 text-center">Actions</th>
          </tr>
          {/* Add new row inputs */}
          <tr className="bg-gray-50">
            {columns.map((col) =>
              col.key === "id" ? null : (
                <td key={col.key} className="border px-2 py-1">
                  <input
                    type="text"
                    className="w-full border rounded px-2 py-1"
                    value={newRow[col.key] ?? ""}
                    onChange={(e) => setNewRow({ ...newRow, [col.key]: e.target.value })}
                  />
                </td>
              )
            )}
            <td className="border px-2 py-1 text-center">
              <button
                onClick={handleAddRow}
                className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Add
              </button>
            </td>
          </tr>
        </thead>

        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="hover:bg-gray-50">
              {columns.map((col) =>
                col.key === "id" ? null : (
                  <td key={col.key} className="border px-2 py-1">
                    <input
                      type="text"
                      className="w-full border rounded px-2 py-1"
                      value={row[col.key] ?? ""}
                      onChange={(e) => (row[col.key] = e.target.value)}
                      onBlur={() => handleUpdateRow(row.id, row)}
                    />
                  </td>
                )
              )}
              <td className="border px-2 py-1 text-center">
                <button
                  onClick={() => handleDeleteRow(row.id)}
                  className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import EditAssignmentModal from "./EditAssignmentModal";

export default function GradesTable({
    students = [],
    assignments = [],
    categories = [],
    grades = {},
    units = [],
    unitAverages = {},
    weightedAverages = {},
    viewMode = false,
    onGradeUpdated, // callback after saving a grade
    onAssignmentModified, // callback after editing/deleting an assignment
}) {
    const [columns, setColumns] = useState(assignments);
    const [editingCell, setEditingCell] = useState(null); // { studentId, colId }
    const [tempValue, setTempValue] = useState("");
    const [editingAssignment, setEditingAssignment] = useState(null);
    const [showAssignmentModal, setShowAssignmentModal] = useState(false);

    useEffect(() => {
        setColumns(viewMode ? units : assignments);
    }, [viewMode, assignments, units]);

    if (!students || students.length === 0) return <p>No students found.</p>;

    const handleCellClick = (studentId, colId, currentValue) => {
        setEditingCell({ studentId, colId });
        setTempValue(currentValue != null ? currentValue : "");
    };

    const handleSave = async () => {
        if (!editingCell) return;

        const { studentId, colId } = editingCell;
        const valueToSave = tempValue === "" ? null : Number(tempValue);

        try {
            await window.api.updateGrade(studentId, colId, valueToSave);
            console.log("Saving grade for student ", studentId, " assignment ", colId, " value ", valueToSave);
            if (onGradeUpdated) onGradeUpdated(); // refresh parent
        } catch (error) {
            console.error("Error saving grade:", error);
            alert("Failed to save grade. See console for details.");
        } finally {
            setEditingCell(null);
            setTempValue("");
        }
    };

    const renderCell = (s, col) => {
        const studentGrades = grades[s.id] || {};
        const value = viewMode
            ? (unitAverages[s.id]?.[col.id] ?? null)
            : (studentGrades[col.id] ?? null);

        const isEditing =
            editingCell &&
            editingCell.studentId === s.id &&
            editingCell.colId === col.id;

        if (isEditing) {
            return (
                <td className="border px-4 py-2 text-center">
                    <input
                        type="number"
                        value={tempValue}
                        autoFocus
                        onChange={(e) => setTempValue(e.target.value)}
                        onBlur={handleSave}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") handleSave();
                            if (e.key === "Escape") setEditingCell(null);
                        }}
                        className="border rounded px-2 py-1 w-20 text-center"
                    />
                </td>
            );
        }

        return (
            <td
                key={col.id}
                className={`border px-4 py-2 text-center cursor-pointer hover:bg-gray-100`}
                onClick={() => !viewMode && handleCellClick(s.id, col.id, value)}
            >
                {viewMode
                    ? value != null
                        ? (value * 100).toFixed(2) + "%"
                        : ""
                    : value != null
                        ? value
                        : ""}
            </td>
        );
    };

    return (
        <div className="overflow-x-auto">
            <table className="table-auto border-collapse border border-gray-400 min-w-max">
                <thead>
                    <tr>
                        <th className="border px-4 py-2 max-w-[150px]">Last Name</th>
                        <th className="border px-4 py-2 max-w-[150px]">First Name</th>
                        {columns.map((col) => (
                            <th
                                key={col.id}
                                className="border px-4 py-2 max-w-[150px] text-center"
                                onClick={() => {
                                    if (!viewMode) {
                                        setEditingAssignment(col);
                                        setShowAssignmentModal(true);
                                    }
                                }
                                }
                            >
                                {col.name}
                            </th>
                        ))}
                        <th className="border px-4 py-2 max-w-[150px] text-center">
                            Average
                        </th>
                    </tr>

                    {!viewMode && (
                        <tr>
                            <th className="border px-4 py-1"></th>
                            <th className="border px-4 py-1"></th>
                            {assignments.map((a) => (
                                <th
                                    key={`unit-${a.id}`}
                                    className="border px-4 py-1 text-center text-sm text-gray-600"
                                >
                                    {a.unit_name ?? ""}
                                </th>
                            ))}
                            <th className="border px-4 py-1"></th>
                        </tr>
                    )}
                </thead>

                <tbody>
                    {students.map((s) => (
                        <tr key={s.id}>
                            <td className="border px-4 py-2">{s.last_name}</td>
                            <td className="border px-4 py-2">{s.first_name}</td>
                            {columns.map((col) => renderCell(s, col))}
                            <td className="border px-4 py-2 text-center font-semibold">
                                {weightedAverages[s.id]?.weighted_average != null
                                    ? (weightedAverages[s.id].weighted_average).toFixed(
                                        2
                                    ) + "%"
                                    : ""}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <EditAssignmentModal
                show={showAssignmentModal}
                handleClose={() => setShowAssignmentModal(false)}
                assignment={editingAssignment}
                categories={categories}
                modules={units} // pass in units/modules as options
                onModified={() => {
                    if (onAssignmentModified) onAssignmentModified(); // refresh table data
                }}
            />
        </div>

    );
}

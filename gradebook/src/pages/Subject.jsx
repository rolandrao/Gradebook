import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CreateAssignmentModal from "../components/CreateAssignmentModal";
import EditGradeModal from "../components/EditGradeModal";
import ViewToggle from "../components/ViewToggle";
import GradesTable from "../components/GradesTable";

export default function Subject() {
  const { subjectName } = useParams();
  const [subjectID, setSubjectID] = useState(null);

  const [students, setStudents] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [categories, setCategories] = useState([]);
  const [grades, setGrades] = useState([]);

  const [showCreateAssignment, setShowCreateAssignment] = useState(false);
  const [showEditGrade, setShowEditGrade] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [units, setUnits] = useState([]);
  const [unitAverages, setUnitAverages] = useState({});
  const [weightedAverages, setWeightedAverages] = useState({});

  const [viewMode, setViewMode] = useState(false); // True => assignments False => units

  const fetchGrades = async () => {
    if (!subjectID) return; // wait until subjectID is ready
    try {
      const [studentsData, assignmentsData, categoriesData, gradesData, unitsData, unitAverages, weightedAverages] = await Promise.all([
        window.api.getStudents(),
        window.api.getAssignmentsBySubject(subjectID),
        window.api.getCategories(subjectID),
        window.api.getGradesBySubject(subjectID),
        window.api.getUnitsBySubject(subjectID),
        window.api.getUnitAveragesBySubject(subjectID),
        window.api.getWeightedAverageBySubject(subjectID),
      ]);

      setStudents(studentsData);
      setAssignments(assignmentsData);
      setCategories(categoriesData);
      setUnits(unitsData);

      const gradesMap = {};
      for (const row of gradesData) {
        if (!gradesMap[row.student_id]) {
          gradesMap[row.student_id] = {};
        }
        gradesMap[row.student_id][row.assignment_id] = row.points;
      }

      setGrades(gradesMap);

      const unitAverageMap = {}
      for (const row of unitAverages) {
        if (!unitAverageMap[row.student_id]) {
          unitAverageMap[row.student_id] = {};
        }
        unitAverageMap[row.student_id][row.unit_id] = row.unit_average;
      }

      setUnitAverages(unitAverageMap);

      const weightedAverageMap = {}
      for (const row of weightedAverages) {
        weightedAverageMap[row.student_id] = row;
      }

      setWeightedAverages(weightedAverageMap);

      console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
      console.log("Students Data:", studentsData);
      console.log("Assignments Data:", assignmentsData);
      console.log("Grades Data:", gradesData);
      console.log("Units Data:", unitsData);
      console.log("Unit Averages:", unitAverages);
      console.log("Weighted Averages:", weightedAverages);
      console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");


    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // 🔄 Get subjectID from subjectName
  useEffect(() => {
    const fetchSubjectID = async () => {
      if (!subjectName) return;
      try {
        const id = await window.api.getSubjectID(subjectName);
        setSubjectID(id);
      } catch (error) {
        console.error("Error fetching subjectID:", error);
      }
    };
    fetchSubjectID();
  }, [subjectName]);

  // 🔄 Fetch everything for this subject


  // Load students/assignments/grades once subjectID is known
  useEffect(() => {
    fetchGrades();
  }, [subjectID]);

  // 🔄 Refresh after creating an assignment
  const handleAssignmentCreated = () => {
    setShowCreateAssignment(false);
    fetchGrades();
  };

  const handleAssignmentModifiied = () => {
    fetchGrades();
  }

  // 🔄 Open edit modal when clicking a grade cell
  const handleGradeClick = (studentID, assignmentID, currentGrade) => {

    setSelectedGrade({studentID, assignmentID, currentGrade});
    setShowEditGrade(true);
  };

  // 🔄 Refresh after saving grade
  const handleGradeSaved = () => {
    setShowEditGrade(false);
    fetchGrades();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        {subjectName ? subjectName.toUpperCase() : "Unknown Subject"}
      </h1>

      <button
        onClick={() => setShowCreateAssignment(true)}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg mb-4 hover:bg-blue-600"
      >
        + Create Assignment
      </button>

      {/* View toggle */}
      <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />


      <GradesTable
        students={students}
        assignments={assignments}
        categories={categories}
        grades={grades}
        units={units}
        unitAverages={unitAverages}
        weightedAverages={weightedAverages}
        viewMode={viewMode}
        onGradeUpdated={handleGradeSaved}
        onAssignmentModified={handleAssignmentModifiied}
      />



      {/* Create Assignment Modal */}
      {showCreateAssignment && (
        <CreateAssignmentModal
          show={showCreateAssignment}
          handleClose={() => setShowCreateAssignment(false)}
          subjectName={subjectName}
          subjectID={subjectID}
          onAssignmentCreated={handleAssignmentCreated}
        />
      )}

      {/* Edit Grade Modal */}
      {showEditGrade && selectedGrade && (
        <EditGradeModal
          grade={selectedGrade}
          onClose={() => setShowEditGrade(false)}
          onSaved={handleGradeSaved}
        />
      )}
    </div>
  );
}

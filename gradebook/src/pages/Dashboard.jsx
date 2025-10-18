import { useEffect, useState } from "react";

function Dashboard() {
  const [students, setStudents] = useState([]);
  const [grades, setGrades] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const studs = await window.api.getStudents();
      setStudents(studs);

      const allSubjects = await window.api.getSubjects();
      const allGrades = [];

      for (const subj of allSubjects) {
        const cats = await window.api.getCategories(subj.id);
        for (const cat of cats) {
          const asns = await window.api.getAssignmentsByCategory(cat.id);
          for (const asn of asns) {
            const grs = await window.api.getGrades(asn.id);
            allGrades.push(...grs);
          }
        }
      }

      setGrades(allGrades);
    }

    fetchData();
  }, []);

  const average = (arr) =>
    arr.length ? (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(2) : "N/A";

  const overallAverage = average(grades.map((g) => g.score || 0));

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">
        Dashboard
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-2 text-gray-700">
            Overall Class Average
          </h2>
          <p className="text-3xl font-bold text-blue-600">{overallAverage}</p>
        </div>

        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-2 text-gray-700">
            Total Students
          </h2>
          <p className="text-3xl font-bold text-green-600">{students.length}</p>
        </div>

        {/* Example placeholder for future analytics */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-2 text-gray-700">
            Assignments Recorded
          </h2>
          <p className="text-3xl font-bold text-purple-600">{grades.length}</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

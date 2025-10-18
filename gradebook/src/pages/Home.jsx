import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const subjects = [
    { name: 'Math', color: 'bg-blue-500' },
    { name: 'Reading', color: 'bg-yellow-400' },
    { name: 'Writing', color: 'bg-gray-400' },
    { name: 'Social Studies', color: 'bg-green-400' },
    { name: 'Science', color: 'bg-red-500' },
    { name: 'Spelling', color: 'bg-pink-400' },
  ];

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-8 text-center">My Classes</h1>
      <div className="flex justify-end mb-6">
        <button
          onClick={() => navigate("/settings")}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Settings
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {subjects.map((subj) => (
          <Link
            key={subj.name}
            to={`/subject/${subj.name}`}
            className={`${subj.color} h-48 shadow-lg rounded-xl hover:shadow-2xl transition flex items-center justify-center text-2xl font-bold text-white`}
          >
            {subj.name}
          </Link>
        ))}
      </div>
    </div>
  );
}

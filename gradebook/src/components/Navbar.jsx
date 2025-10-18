import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-blue-600 text-white px-6 py-4 flex items-center justify-between shadow-md">
      <div className="text-2xl font-bold">Gradebook</div>
      <div className="flex gap-6">
        <Link
          to="/"
          className="text-white hover:bg-blue-500 px-3 py-2 rounded transition duration-200"
        >
          Home
        </Link>
        <Link
          to="/dashboard"
          className="text-white hover:bg-blue-500 px-3 py-2 rounded transition duration-200"
        >
          Dashboard
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;

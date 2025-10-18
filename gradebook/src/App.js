import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Subject from './pages/Subject';
import Dashboard from './pages/Dashboard';
import Navbar from './components/Navbar';
import Settings from './pages/Settings';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />

        <main className="flex-1">
          <Routes>
            {/* Home page */}
            <Route path="/" element={<Home />} />

            {/* Subject page with dynamic subjectName */}
            <Route path="/subject/:subjectName" element={<Subject />} />

            {/* Dashboard page */}
            <Route path="/dashboard" element={<Dashboard />} />

            {/* Settings page */}
            <Route path="/settings" element={<Settings />} />

            {/* Fallback for unknown routes */}
            <Route
              path="*"
              element={
                <div className="p-8 text-center text-xl">
                  Page not found
                </div>
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;

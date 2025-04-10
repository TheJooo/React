import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import CPFSearch from "./components/CPFSearch";
import Home from "./components/Home";
import ProtectedRoute from "./components/ProtectedRoute";
import { UserProvider } from "./context/UserContext";
import UserManager from "./components/UserManager"; 

function AppContent() {
  const location = useLocation();
  const showNav = location.pathname !== "/"; // Hide nav when on login page

  return (
    <div className="flex flex-col items-center p-6">
      {showNav && (
        <nav className="mb-4">
          <Link to="/" className="mr-4 text-blue-500">Home</Link>
          <Link to="/lookup" className="mr-4 text-blue-500">Lookup User</Link>
          <Link to="/users" className="text-blue-500">User Manager</Link> 
        </nav>
      )}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/lookup"
          element={
            <ProtectedRoute>
              <CPFSearch />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <UserManager />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <UserProvider>
      <Router>
        <AppContent />
      </Router>
    </UserProvider>
  );
}

export default App;

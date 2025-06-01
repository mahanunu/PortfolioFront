import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import { useState, useEffect } from 'react';
import ProjectList from './components/ProjectList';
import ProjectDetail from './components/ProjectDetail';
import ContactForm from './components/ContactForm';
import AdminDashboard from './components/AdminDashboard';

console.log('App.jsx: Script loaded. Login component imported:', Login);

function App() {
  console.log('App.jsx: App component function executing.');

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    console.log('App.jsx: useEffect for auth check running.');
    const token = localStorage.getItem('token');
    if (token) {
      console.log('App.jsx: Token found in localStorage:', token);
      setIsAuthenticated(true);
      setUser({ email: 'user@example.com' });
    } else {
      console.log('App.jsx: No token found in localStorage.');
    }
  }, []);

  const handleLogout = () => {
    console.log('App.jsx: handleLogout called.');
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('token');
  };

  console.log('App.jsx: Rendering Router. isAuthenticated:', isAuthenticated);

  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            {!isAuthenticated ? (
              <>
                <li>
                  <Link to="/login">Login</Link>
                </li>
                <li>
                  <Link to="/register">Register</Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <span>Welcome, {user?.email}</span>
                </li>
                <li>
                  <button onClick={handleLogout}>Logout</button>
                </li>
              </>
            )}
          </ul>
        </nav>

        <Routes>
          <Route path="/register" element={<Register />} />
          <Route 
            path="/login" 
            element={
              !isAuthenticated ? (
                <Login setIsAuthenticated={setIsAuthenticated} setUser={setUser} />
              ) : (
                <Navigate to="/" replace />
              )
            } 
          />
          <Route 
            path="/" 
            element={
              isAuthenticated ? (
                <ProjectList />
              ) : (
                <Navigate to="/login" replace />
              )
            } 
          />
          <Route path="/project/:id" element={<ProjectDetail />} />
          <Route path="/contact" element={<ContactForm />} />
          <Route 
            path="/admin" 
            element={
              isAuthenticated ? (
                <AdminDashboard />
              ) : (
                <Navigate to="/login" replace />
              )
            } 
          />
          <Route path="*" element={<h1>Page non trouvée par React Router (dans App.jsx)</h1>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App; 
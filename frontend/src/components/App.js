import { BrowserRouter, Routes, Route } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

// Import styling
import '../style/css/reset.css';
import '../style/css/main.css';
import '@flaticon/flaticon-uicons/css/all/all.css';

// Import components
import Home from './secction-component/Home';
import Login from './secction-component/Login';
import Register from './secction-component/Register';
import AdminDashboard from './secction-component/AdminDashboard';
import UserDashboard from './secction-component/UserDashboard';
import ProtectedRoute from './ProtectedRoute'; // Import the ProtectedRoute component
import Congratulations from './secction-component/congrats-page/Congratulations';
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Initialize authentication state from localStorage
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (userData && typeof userData.isAdmin === 'boolean') {
      setIsAuthenticated(true);
      setIsAdmin(userData.isAdmin);
    }
  }, []);

  return (
    <div className="App">
      <div className="container">
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route
              path="/login"
              element={
                <Login
                  setIsAuthenticated={setIsAuthenticated}
                  setIsAdmin={setIsAdmin}
                />
              }
            />
            <Route path="/register" element={<Register />} />

            {/* Protected routes */}
            <Route
              path="/user-dashboard"
              element={
                <ProtectedRoute
                  isAuthenticated={isAuthenticated}
                  requiredAdmin={false}
                >
                  <UserDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user-congratulations"
              element={
                <ProtectedRoute
                  isAuthenticated={isAuthenticated}
                  isAdmin={isAdmin}
                  requiredAdmin={false}
                >
                  <Congratulations/>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin-dashboard"
              element={
                <ProtectedRoute
                  isAuthenticated={isAuthenticated}
                  isAdmin={isAdmin}
                  requiredAdmin={true}
                >
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App;

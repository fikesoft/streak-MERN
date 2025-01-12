import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ isAuthenticated, isAdmin, requiredAdmin, children }) => {
    // If the user is not authenticated, redirect to login
    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    // If the route requires admin access and the user is not an admin, redirect to user-dashboard
    if (requiredAdmin && !isAdmin) {
        return <Navigate to="/user-dashboard" />;
    }

    // Otherwise, render the children
    return children;
};

export default ProtectedRoute;

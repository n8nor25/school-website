import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
    const { user, isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/student-life-login" replace />;
    }

    if (allowedRoles && user && !allowedRoles.includes(user.type)) {
        // If user is logged in but doesn't have permission, redirect to home or appropriate dashboard
        if (user.type === 'student') {
            return <Navigate to="/student-dashboard" replace />;
        } else if (user.type === 'admin') {
            return <Navigate to="/admin-dashboard" replace />;
        }
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;

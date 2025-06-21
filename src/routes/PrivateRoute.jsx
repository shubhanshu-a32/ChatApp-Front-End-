import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { SocketContext } from '../context/SocketContext';

const PrivateRoute = () => {
  const { currentUser } = useContext(SocketContext);
  const isAuthenticated = !!currentUser;
  const location = useLocation();

  // If user is authenticated and tries to access /, redirect to /chat
  if (isAuthenticated && location.pathname === '/') {
    return <Navigate to="/chat" replace />;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
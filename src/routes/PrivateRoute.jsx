import { Navigate, Outlet } from 'react-router-dom';
import { useContext } from 'react';
import { SocketContext } from '../context/SocketContext';

const PrivateRoute = () => {
  const { currentUser } = useContext(SocketContext);
  const isAuthenticated = !!currentUser;

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
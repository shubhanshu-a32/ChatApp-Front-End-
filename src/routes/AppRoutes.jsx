import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Chat from '../pages/Chat';
import Profile from '../pages/Profile';
import PrivateRoute from './PrivateRoute';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Private Routes */}
      <Route element={<PrivateRoute />}>
        <Route path="/chat" element={<Chat />} />
        <Route path="/profile" element={<Profile />} />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<h1 className="text-center mt-10 text-2xl">404 - Page Not Found</h1>} />
    </Routes>
  );
};

export default AppRoutes;
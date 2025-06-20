import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { SocketContext } from '../context/SocketContext';
import toast from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:5000';

const useAuth = () => {
  const { setCurrentUser } = useContext(SocketContext);
  const navigate = useNavigate();

  const login = async (data) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/api/auth/login`, data, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        setCurrentUser(res.data.user);
        toast.success('Login successful');
        navigate('/chat');
      } else {
        throw new Error('No token received');
      }
    } catch (err) {
      console.error('Login error:', err);
      toast.error(err.response?.data?.message || 'Login failed. Please try again.');
      throw err;
    }
  };

  const register = async (data) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/api/auth/register`, data, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        setCurrentUser(res.data.user);
        toast.success('Registered successfully');
        navigate('/chat');
      } else {
        throw new Error('No token received');
      }
    } catch (err) {
      console.error('Registration error:', err);
      toast.error(err.response?.data?.message || 'Registration failed. Please try again.');
      throw err;
    }
  };

  const googleLogin = async (googleToken) => {
    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/auth/google`,
        { token: googleToken },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      
      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        setCurrentUser(res.data.user);
        toast.success('Google login successful');
        navigate('/chat');
      } else {
        throw new Error('No token received');
      }
    } catch (err) {
      console.error('Google login error:', err);
      toast.error('Google login failed. Please try again.');
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
    toast.success('Logged out');
    navigate('/login');
  };

  return { login, register, googleLogin, logout };
};

export default useAuth;
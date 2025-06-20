import { createContext, useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';
import toast from 'react-hot-toast';

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const authErrorToastId = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      console.log('No token found in localStorage');
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setCurrentUser(res.data.user);

        const newSocket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000', {
          auth: { token },
          transports: ['websocket', 'polling'],
          reconnection: true,
          reconnectionAttempts: 5,
          reconnectionDelay: 1000,
          path: '/socket.io',
          withCredentials: true,
          autoConnect: true,
          forceNew: true,
        });

        newSocket.on('connect', () => {
          console.log('Socket connected successfully');
          setIsConnected(true);
          toast.success('Connected to chat server');
        });

        newSocket.on('connect_error', (error) => {
          console.error('Socket connection error:', error);
          setIsConnected(false);
          
          if (error.message.includes('Authentication error')) {
            if (!authErrorToastId.current || !toast.isActive(authErrorToastId.current)) {
              authErrorToastId.current = toast.error('Authentication failed. Please log in again.');
            }
            localStorage.removeItem('token');
            setCurrentUser(null);
            newSocket.disconnect();
          } else {
            toast.error('Connection error. Please try again.');
          }
        });

        newSocket.on('disconnect', (reason) => {
          console.log('Socket disconnected:', reason);
          setIsConnected(false);
          
          if (reason === 'io server disconnect') {
            // Server initiated disconnect, try to reconnect
            newSocket.connect();
          } else if (reason === 'io client disconnect') {
            // Client initiated disconnect, don't reconnect
            toast.error('Disconnected from chat server');
          }
        });

        newSocket.on('error', (error) => {
          console.error('Socket error:', error);
          toast.error('Connection error. Please try again.');
        });

        setSocket(newSocket);

        return () => {
          if (newSocket) {
            newSocket.removeAllListeners();
            newSocket.disconnect();
          }
        };
      } catch (err) {
        console.error('Error fetching user or connecting socket:', err);
        if (!authErrorToastId.current || !toast.isActive(authErrorToastId.current)) {
          authErrorToastId.current = toast.error('Failed to connect. Please log in again.');
        }
        localStorage.removeItem('token');
        setCurrentUser(null);
      }
    };

    fetchUser();
  }, []);

  return (
    <SocketContext.Provider value={{ socket, currentUser, setCurrentUser, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};
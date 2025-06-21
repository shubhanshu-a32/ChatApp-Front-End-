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

  // Function to establish socket connection
  const establishSocketConnection = (token) => {
    console.log('🔌 Establishing socket connection with token:', token ? 'present' : 'missing');
    
    const newSocket = io(import.meta.env.VITE_SERVER_URL || 'http://localhost:5000', {
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
      console.log('✅ Socket connected successfully');
      setIsConnected(true);
      toast.success('Connected to chat server');
    });

    newSocket.on('connect_error', (error) => {
      console.error('❌ Socket connection error:', error);
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
      console.log('🔌 Socket disconnected:', reason);
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
      console.error('❌ Socket error:', error);
      toast.error('Connection error. Please try again.');
    });

    // Add listeners for online users events
    newSocket.on('online-users', (users) => {
      console.log('👥 Received online users:', users);
    });

    newSocket.on('user-online', (user) => {
      console.log('🟢 User came online:', user);
    });

    newSocket.on('user-offline', (data) => {
      console.log('🔴 User went offline:', data);
    });

    setSocket(newSocket);
  };

  // Initial setup - check for existing token and fetch user
  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      console.log('No token found in localStorage');
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_SERVER_URL || 'http://localhost:5000'}/api/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setCurrentUser(res.data.user);
        establishSocketConnection(token);
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

  // Handle socket connection when currentUser is set (e.g., after Google OAuth login)
  useEffect(() => {
    if (currentUser && !socket) {
      const token = localStorage.getItem('token');
      if (token) {
        establishSocketConnection(token);
      }
    }
  }, [currentUser, socket]);

  // Cleanup socket on unmount
  useEffect(() => {
    return () => {
      if (socket) {
        socket.removeAllListeners();
        socket.disconnect();
      }
    };
  }, [socket]);

  return (
    <SocketContext.Provider value={{ socket, currentUser, setCurrentUser, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};
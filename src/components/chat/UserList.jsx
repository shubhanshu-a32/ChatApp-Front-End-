import { useContext, useEffect, useState } from 'react';
import { SocketContext } from '../../context/SocketContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import ErrorBoundary from '../ErrorBoundary';

const UserList = ({ onSelectUser, selectedUser }) => {
  const { currentUser, socket } = useContext(SocketContext);
  const [users, setUsers] = useState([]);
  const [onlineUserIds, setOnlineUserIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchUsers = async () => {
      if (!currentUser?._id) return;

      try {
        setLoading(true);
        setError(null);
        const res = await axios.get(`${import.meta.env.VITE_SERVER_URL || 'http://localhost:5000'}/api/users`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        
        if (isMounted) {
          console.log('Fetched users from /api/users:', res.data);
          setUsers(Array.isArray(res.data) ? res.data : []);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
        if (isMounted) {
          setError('Failed to fetch users');
          toast.error('Failed to fetch users');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchUsers();

    if (socket) {
      const handleOnlineUsers = (onlineUsers) => {
        console.log('👥 UserList received online users:', onlineUsers);
        if (isMounted) {
          const ids = new Set(onlineUsers.map(user => user._id));
          console.log('👥 Setting online user IDs:', Array.from(ids));
          setOnlineUserIds(ids);
        }
      };
      
      const handleUserOnline = (user) => {
        console.log('🟢 UserList: User came online:', user);
        if (isMounted && user?._id) {
          setOnlineUserIds(prev => {
            const newSet = new Set(prev).add(user._id);
            console.log('🟢 Updated online user IDs:', Array.from(newSet));
            return newSet;
          });
        }
      };
      
      const handleUserOffline = ({ userId }) => {
        console.log('🔴 UserList: User went offline:', userId);
        if (isMounted && userId) {
          setOnlineUserIds(prev => {
            const newSet = new Set(prev);
            newSet.delete(userId);
            console.log('🔴 Updated online user IDs after offline:', Array.from(newSet));
            return newSet;
          });
        }
      };

      socket.on('online-users', handleOnlineUsers);
      socket.on('user-online', handleUserOnline);
      socket.on('user-offline', handleUserOffline);
      
      console.log('📡 Emitting get-online-users');
      socket.emit('get-online-users');

      return () => {
        socket.off('online-users', handleOnlineUsers);
        socket.off('user-online', handleUserOnline);
        socket.off('user-offline', handleUserOffline);
      };
    }

    return () => {
      isMounted = false;
    };
  }, [socket, currentUser?._id]);
  
  // Debug log before rendering
  console.log('UserList render, users:', users, 'type:', typeof users, 'isArray:', Array.isArray(users));

  if (!currentUser) {
    return (
      <div className="w-64 text-black rounded-lg shadow p-4">
        <h3 className="text-lg font-semibold mb-4">All Users</h3>
        <div className="text-gray-500">Please log in to see the user list.</div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="w-64 bg-white rounded-lg shadow p-4">
        <h3 className="text-lg font-semibold mb-4">Users</h3>
        <div className="text-gray-500">Loading users...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-64 bg-white rounded-lg shadow p-4">
        <h3 className="text-lg font-semibold mb-4">Users</h3>
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="w-64 bg-white rounded-lg shadow p-4">
      <h3 className="text-lg font-semibold mb-4">All Users</h3>
      <div className="space-y-2">
        {(Array.isArray(users) ? users : []).map((user) => {
          const isOnline = onlineUserIds.has(user._id);
          return (
            <div
              key={user._id}
              onClick={() => onSelectUser(user)}
              className={`p-2 rounded cursor-pointer flex items-center justify-between ${
                selectedUser?._id === user._id
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-50 hover:bg-gray-100'
              }`}
            >
              <span>{user.name || `User ${user._id}`}</span>
              {isOnline && <span className="w-2 h-2 bg-green-500 rounded-full"></span>}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Wrap the component with ErrorBoundary
const UserListWithErrorBoundary = (props) => (
  <ErrorBoundary>
    <UserList {...props} />
  </ErrorBoundary>
);

export default UserListWithErrorBoundary;
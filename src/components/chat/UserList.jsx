import { useContext, useEffect, useState } from 'react';
import { SocketContext } from '../../context/SocketContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import ErrorBoundary from '../ErrorBoundary';

const UserList = ({ onSelectUser, selectedUser, unreadUserIds = new Set() }) => {
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
  
  // Re-emit get-online-users and refetch users when socket connects or user logs in
  useEffect(() => {
    if (socket && currentUser?._id) {
      socket.emit('get-online-users');
      // Refetch users to ensure the list is up to date
      (async () => {
        try {
          const res = await axios.get(`${import.meta.env.VITE_SERVER_URL || 'http://localhost:5000'}/api/users`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });
          setUsers(Array.isArray(res.data) ? res.data : []);
        } catch {}
      })();
    }
  }, [socket, currentUser?._id]);
  
  // Also refresh online users after socket reconnect
  useEffect(() => {
    if (socket) {
      socket.on('connect', () => {
        console.log('UserList: Socket reconnected, refreshing online users');
        socket.emit('get-online-users');
      });
    }
    return () => {
      if (socket) {
        socket.off('connect');
      }
    };
  }, [socket]);
  
  // Debug log before rendering
  console.log('UserList render, users:', users, 'onlineUserIds:', Array.from(onlineUserIds), 'unreadUserIds:', Array.from(unreadUserIds));

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
      <h3 className="text-lg font-semibold mb-2">All Users</h3>
      <div className="mb-2 text-sm text-green-700 font-semibold">
        Online Users: {onlineUserIds.size}/{users.length}
      </div>
      <div className="space-y-2">
        {(Array.isArray(users) ? users : []).map((user) => {
          const isOnline = onlineUserIds.has(user._id);
          const hasUnread = unreadUserIds.has(user._id);
          return (
            <div
              key={user._id}
              onClick={() => onSelectUser(user)}
              className={`p-2 rounded cursor-pointer flex items-center justify-between transition-colors duration-150
                ${selectedUser?._id === user._id
                  ? 'bg-blue-600 text-white'
                  : isOnline
                    ? 'bg-green-50 text-black font-semibold border border-green-400'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'}
              `}
            >
              <span className="truncate flex items-center gap-2" style={{ maxWidth: '120px' }}>
                {user.name || `User ${user._id}`}
                {hasUnread && (
                  <span className="inline-block w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse" title="New message"></span>
                )}
              </span>
              {isOnline && (
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 bg-green-500 rounded-full border-2 border-white shadow"></span>
                  <span className="text-xs text-green-700 font-bold">Online</span>
                </span>
              )}
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
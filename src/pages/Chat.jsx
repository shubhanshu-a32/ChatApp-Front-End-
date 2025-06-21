import { useState, useEffect, useCallback } from 'react';
import UserList from '../components/chat/UserList';
import ChatBox from '../components/chat/ChatBox';

const Chat = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [unreadUserIds, setUnreadUserIds] = useState(new Set());

  // Add a userId to the unread set
  const addUnreadUserId = useCallback((userId) => {
    setUnreadUserIds(prev => new Set(prev).add(userId));
  }, []);

  // Clear unread for selected user
  useEffect(() => {
    if (selectedUser?._id) {
      setUnreadUserIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(selectedUser._id);
        return newSet;
      });
    }
  }, [selectedUser]);

  return (
    <div className="flex h-[calc(100vh-120px)]">
      <div className="w-1/4 border-r">
        <UserList onSelectUser={setSelectedUser} selectedUser={selectedUser} unreadUserIds={unreadUserIds} />
      </div>
      <div className="w-3/4">
        <ChatBox selectedUser={selectedUser} addUnreadUserId={addUnreadUserId} />
      </div>
    </div>
  );
};

export default Chat;
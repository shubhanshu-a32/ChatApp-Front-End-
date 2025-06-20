import { useState } from 'react';
import UserList from '../components/chat/UserList';
import ChatBox from '../components/chat/ChatBox';

const Chat = () => {
  const [selectedUser, setSelectedUser] = useState(null);

  return (
    <div className="flex h-[calc(100vh-120px)]">
      <div className="w-1/4 border-r">
        <UserList onSelectUser={setSelectedUser} />
      </div>
      <div className="w-3/4">
        <ChatBox selectedUser={selectedUser} />
      </div>
    </div>
  );
};

export default Chat;
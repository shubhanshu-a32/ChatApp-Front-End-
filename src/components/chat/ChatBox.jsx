import { useContext, useEffect, useRef, useState } from 'react';
import { SocketContext } from '../../context/SocketContext';
import MessageItem from './MessageItem';
import { toast } from 'react-hot-toast';

const ChatBox = ({ selectedUser, addUnreadUserId }) => {
  const { socket, currentUser } = useContext(SocketContext);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const scrollRef = useRef(null);
  // Track which users have already triggered an alert
  const alertedUserIds = useRef(new Set());

  useEffect(() => {
    if (!selectedUser || !socket) {
      console.log('ChatBox: No selectedUser or socket', { selectedUser, socket });
      return;
    }

    // Ensure consistent roomId for both users
    const sortedIds = [currentUser._id, selectedUser._id].sort();
    const roomId = sortedIds.join('_');
    console.log('ChatBox: Joining room', roomId);
    socket.emit('joinRoom', roomId);

    const handleChatHistory = (data) => {
      console.log('ChatBox: Received chatHistory', data);
      setMessages(data);
    };
    const handleReceiveMessage = (msg) => {
      if (msg.from !== currentUser._id) {
        console.log('ChatBox: Received message', msg);
        // Only alert the first time for this user in this session and if chat is not open
        if (msg.from !== selectedUser?._id && typeof addUnreadUserId === 'function') {
          addUnreadUserId(msg.from);
          if (!alertedUserIds.current.has(String(msg.from))) {
            alertedUserIds.current.add(String(msg.from));
            window.alert(`New message from ${msg.user || 'a user'}!`);
          }
        }
      }
      setMessages((prev) => [...prev, msg]);
    };

    socket.off('chatHistory', handleChatHistory);
    socket.off('receive_message', handleReceiveMessage);
    socket.on('chatHistory', handleChatHistory);
    socket.on('receive_message', handleReceiveMessage);

    return () => {
      socket.off('chatHistory', handleChatHistory);
      socket.off('receive_message', handleReceiveMessage);
    };
  }, [selectedUser, socket, currentUser._id, addUnreadUserId]);

  const sendMessage = () => {
    if (!message.trim()) return;
    if (!socket) {
      console.log('ChatBox: Cannot send message, socket not connected');
      return;
    }

    // Ensure consistent roomId for both users
    const sortedIds = [currentUser._id, selectedUser._id].sort();
    const roomId = sortedIds.join('_');

    const msgData = {
      to: selectedUser._id,
      from: currentUser._id,
      content: message, // Use 'content' to match server
      roomId,
    };

    console.log('ChatBox: Sending message', msgData);
    socket.emit('send_message', msgData);
    // Do NOT add the message locally; wait for the socket to echo it back
    setMessage('');
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!selectedUser) return <p className="text-center mt-10">Select a user to chat with</p>;
  if (!socket) return <p className="text-center mt-10 text-red-500">Socket not connected</p>;

  return (
    <div className="flex flex-col h-[80vh] border rounded-xl overflow-hidden bg-white dark:bg-zinc-900">
      <div className="bg-blue-600 text-white px-6 py-3 font-bold text-lg shadow flex items-center">
        <span className="truncate">{selectedUser.name}</span>
      </div>
      <div className="flex-1 p-4 overflow-y-auto space-y-2 bg-gray-50 dark:bg-zinc-800">
        {messages.map((msg, i) => (
          <MessageItem key={i} msg={msg} isSelf={msg.from === currentUser._id} />
        ))}
        <div ref={scrollRef} />
      </div>
      <div className="flex items-center p-4 border-t bg-white dark:bg-zinc-900">
        <input
          className="flex-1 p-2 border-2 border-gray-300 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-gray-100"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="ml-3 px-5 py-2 bg-blue-600 text-white rounded-lg font-semibold shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
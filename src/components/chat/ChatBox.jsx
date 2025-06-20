import { useContext, useEffect, useRef, useState } from 'react';
import { SocketContext } from '../../context/SocketContext';
import MessageItem from './MessageItem';
import { toast } from 'react-hot-toast';

const ChatBox = ({ selectedUser }) => {
  const { socket, currentUser } = useContext(SocketContext);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const scrollRef = useRef(null);

  useEffect(() => {
    if (!selectedUser || !socket) return;

    const roomId = `${currentUser._id}_${selectedUser._id}`;
    socket.emit('joinRoom', roomId);

    socket.on('chatHistory', (data) => {
      setMessages(data);
    });

    socket.on('receive_message', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off('chatHistory');
      socket.off('receive_message');
    };
  }, [selectedUser, socket]);

  const sendMessage = () => {
    if (!message.trim()) return;

    // Ensure consistent roomId for both users
    const sortedIds = [currentUser._id, selectedUser._id].sort();
    const roomId = sortedIds.join('_');

    const msgData = {
      to: selectedUser._id,
      from: currentUser._id,
      content: message, // Use 'content' to match server
      roomId,
    };

    socket.emit('send_message', msgData);
    setMessages((prev) => [...prev, { ...msgData, self: true, user: currentUser.name }]);
    setMessage('');
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!selectedUser) return <p className="text-center mt-10">Select a user to chat with</p>;

  return (
    <div className="flex flex-col h-[80vh] border rounded-xl overflow-hidden">
      <div className="bg-blue-600 text-white px-4 py-2 font-bold">{selectedUser.name}</div>
      <div className="flex-1 p-4 overflow-y-auto space-y-2 bg-gray-50">
        {messages.map((msg, i) => (
          <MessageItem key={i} msg={msg} isSelf={msg.from === currentUser._id} />
        ))}
        <div ref={scrollRef} />
      </div>
      <div className="flex items-center p-4 border-t">
        <input
          className="flex-1 p-2 border rounded"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="ml-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
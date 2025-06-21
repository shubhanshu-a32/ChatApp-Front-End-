const MessageItem = ({ msg, isSelf }) => {
  // Use msg.content for message text (as per ChatBox sendMessage)
  const messageText = msg.content || msg.message || '';
  const sender = msg.user || (isSelf ? 'You' : '');
  const time = msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';

  return (
    <div
      className={`flex flex-col max-w-xs mb-2 ${isSelf ? 'ml-auto items-end' : 'items-start'}`}
    >
      <div
        className={`p-3 rounded-2xl shadow-sm break-words
          ${isSelf ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-900'}
        `}
        style={{ minWidth: '60px' }}
      >
        {sender && !isSelf && <div className="text-xs font-semibold text-blue-700 mb-1">{sender}</div>}
        <span className="text-base leading-snug">{messageText}</span>
      </div>
      <span className="text-xs text-gray-400 mt-1">{time}</span>
    </div>
  );
};

export default MessageItem;
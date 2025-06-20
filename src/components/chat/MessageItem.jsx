const MessageItem = ({ msg, isSelf }) => {
  return (
    <div
      className={`max-w-xs p-2 rounded-lg ${
        isSelf ? 'bg-blue-500 text-white ml-auto' : 'bg-gray-200 text-black'
      }`}
    >
      <p className="text-sm">{msg.message}</p>
    </div>
  );
};

export default MessageItem;
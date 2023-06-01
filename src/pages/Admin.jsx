import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

function Admin() {
  const [messages, setMessages] = useState([]);
  const [messagesOut, setMessagesOut] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [joinedUsers, setJoinedUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');

  const sockets = io('http://localhost:3001');
  useEffect(() => {
    const socket = io('http://localhost:3001');
    socket.emit('getJoinedUsers');
    
    socket.on('joinedUsers', (users) => {
      const uniqueUsernames = new Set();
      const filteredUsers = users.filter((user) => {
        if (!uniqueUsernames.has(user.username) && user.username) {
          uniqueUsernames.add(user.username);
          return true;
        }
        return false;
      });
      setJoinedUsers(filteredUsers);
    });

       socket.on('adminMessage', (data) => {
      console.log('Received message:', data);
      const { userId, message } = data;
      console.log(data);
      // Check the type of userId and message
      console.log(typeof data.userId, typeof data.message);
      // Update the messages state with the new message
      setMessages((prevMessages) => [...prevMessages, { userId, message }]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleUserSelect = (user,userId) => {
    setSelectedUser(user);
    setSelectedUserId(userId);
  };

  const handleMessageChange = (event) => {
    setMessagesOut(event.target.value);
  };

    // Handle sending message to the selected user
    const handleSendMessage = () => {
  
      if (selectedUser) {
        sockets.emit('adminMessageOut', { id: selectedUserId, username: selectedUser, messagesOut });
        setMessagesOut('');
      }
    };

  return (
    <div className="flex">
      <div className="w-1/4 bg-gray-200 p-4">
        <h3 className="text-xl mb-4">Joined Users</h3>
        <ul>
          {joinedUsers.map((user) => (
            <li
              key={user.id}
              className={`cursor-pointer p-2 mb-2 ${
                user.username === selectedUser ? 'bg-blue-500 text-white' : 'bg-white'
              }`}
              onClick={() => handleUserSelect(user.username)}
            >
              {user.username}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex-1 p-4">
        <h3 className="text-xl mb-4">Chat</h3>
        {selectedUser ? (
          <div>
            <h4 className="text-lg mb-2">Selected User: {selectedUser}</h4>
            <div className="bg-white p-4 h-80 overflow-y-auto">
              {messages.map((message, index) => (
                <div key={index} className="mb-2">
                  <strong>User {message.userId}: </strong>
                  {message.message}
                </div>
              ))}
            </div>
            <div className="mt-4">
              <input
                type="text"
                value={messagesOut}
                onChange={handleMessageChange}
                className="p-2 border rounded mr-2"
                placeholder="Enter your message"
              />
              <button
                onClick={handleSendMessage}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Send Message
              </button>
            </div>
          </div>
        ) : (
          <p>No user selected.</p>
        )}
      </div>
    </div>
  );
}

export default Admin;
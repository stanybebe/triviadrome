
import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';



function Admin() {
  const [messages, setMessages] = useState([]);
  const [messagesOut, setMessagesOut] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedUserId, setSelectedUserId] = useState('');
  const [joinedUsers, setJoinedUsers] = useState([]);

  const sockets = io('http://localhost:3001');
  useEffect(() => {
    const socket = io('http://localhost:3001');
    socket.emit('getJoinedUsers');

    socket.on('joinedUsers', (users) => {
      setJoinedUsers(users);
      console.log(users);
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
      // socket.off('joinedUsers');
      // Clean up the socket connection
      socket.disconnect();
    };
  }, []);

  const handleUserSelect = (user,userId) => {
    setSelectedUser(user);
    setSelectedUserId(userId);
  };

  // Handle message change
  const handleMessageChange = (event) => {
    setMessagesOut(event.target.value);
  };

  // Handle sending message to the selected user
  const handleSendMessage = () => {
  
    if (selectedUser && messagesOut) {
      sockets.emit('adminMessageOut', { id: selectedUserId, username: selectedUser, messagesOut });
      setMessagesOut('');
    }
  };

  

  return (
    <div>
      <h1>Admin Component</h1>
      <ul>
        {messages.map((message, index) => (
          <li key={index}>
            <strong>User {message.userId}: </strong>
            {message.message}
          </li>
        ))}
      </ul>

      <div>
        <h3>Select a User:</h3>
        {/* Map through the joined users and render clickable divs */}
        {joinedUsers.map((user, index) => (
    <div
      key={index}
            onClick={() => handleUserSelect(user.username, user.id)}
            style={{ cursor: 'pointer' }}
          >
            {user.username}
          </div>
        ))}
      </div>

      <div>
        <h3>Send Message:</h3>
        {/* Display selected user information */}
        {selectedUser && <p>Selected User: {selectedUser}</p>}
        {/* Input field for message */}
        <input
          type="text"
          value={messagesOut}
          onChange={handleMessageChange}
          placeholder="Enter your message"
        />
        {/* Button to send message */}
        <button onClick={handleSendMessage}>Send Message</button>
      </div>
    
    </div>
  );
};

export default Admin


import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';



function Admin() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const socket = io('http://localhost:3001');

    socket.on('adminMessage', (data) => {
      console.log('Received admin message:', data);
      const { userId, message } = data;
      console.log(data);
      // Check the type of userId and message
      console.log(typeof data.userId, typeof data.message);
      // Update the messages state with the new message
      setMessages((prevMessages) => [...prevMessages, { userId, message }]);
    });

    return () => {
      // Clean up the socket connection
      socket.disconnect();
    };
  }, []);

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
    </div>
  );
};

export default Admin

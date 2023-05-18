import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3001'); // Replace with your server URL

function User() {
  const [username, setUsername] = useState ([]);
  const [message, setMessages] = useState([]);


  useEffect(() => {
    socket.on('userMessage', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });
  }, []);


  const handleMessageChange = (event) => {
    setMessages(event.target.value);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    socket.emit('userMessage',{username, message});



 
  };

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  return (
    <div>
      <h2>Welcome, {username}!</h2>
      <form onSubmit={handleSendMessage}>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={handleUsernameChange}
        />

        <label htmlFor="message">Message:</label>
        <input
          type="text"
          id="message"
          value={message}
          onChange={handleMessageChange}
        />

        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default User;
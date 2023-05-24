import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3001'); // Replace with your server URL

function User() {
  const [message, setMessages] = useState([]);
  const [messagesIn, setMessagesIn] = useState([]);
  const [errMessage, setErrmessage] = useState('');
  const usernameRef = useRef(''); // Create a ref for storing the username

  useEffect(() => {
    socket.on('adminMessageIn', (data) => {
      console.log('Received admin message:', data);
      
      
      console.log(data);
      
      if (usernameRef.current === data.username) {
        setMessagesIn((prevMessages) => [...prevMessages,data]);
      }
    });
     
    socket.on('joinError', (data) => {
      setErrmessage(data);
    });

    return () => {
      socket.off('adminMessageIn');
      socket.off('joinError');
    };
  }, []); // Empty dependency array to run effect only once

  const handleMessageChange = (event) => {
    setMessages(event.target.value);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    const username = usernameRef.current; // Access the stored username
    socket.emit('getJoinedUsers', username);
    socket.emit('userMessage', { username, message });
    setMessages('');
  };

  const handleUsernameChange = (event) => {
    usernameRef.current = event.target.value; // Update the stored username
  };

  return (
    <div>
      <h2>Welcome, {usernameRef.current}!</h2>
      <form onSubmit={handleSendMessage}>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
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

      <div>
        {errMessage}
      </div>

      <div>
        <h1>Admin messages</h1>
        <ul>
          {messagesIn.map((mes, index) => (
            <li key={index}>
              <strong> admin:{mes.messagesOut} </strong>
              
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default User;

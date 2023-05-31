import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3001'); // Replace with your server URL

function User() {
  const [message, setMessages] = useState([]);
  const [messagesIn, setMessagesIn] = useState([]);
  const [errMessage, setErrmessage] = useState('');
  const usernameRef = useRef(''); // Create a ref for storing the username

  useEffect(() => {
    const storedUsername = localStorage.getItem('storedUsername');
    if (storedUsername) {
      usernameRef.current = storedUsername;
    }
    console.log(storedUsername);

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
  const newUsername = event.target.value;
  setUsername(newUsername);
  };

  const setUsername = (value) => {
    usernameRef.current = value;
    localStorage.setItem('storedUsername', value);
  };
  

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h2 className="text-2xl mb-4">Welcome, {localStorage.getItem('storedUsername')}!</h2>
      <form onSubmit={handleSendMessage} className="mb-4">
        <label htmlFor="username" className="text-lg">
          Username:
        </label>
        <input
          type="text"
          id="username"
          onChange={handleUsernameChange}
          className="w-full p-2 border rounded"
        />

        <label htmlFor="message" className="text-lg mt-4">
          Message:
        </label>
        <input
          type="text"
          id="message"
          value={message}
          onChange={handleMessageChange}
          className="w-full p-2 border rounded"
        />

        <button
          type="submit"
          className="w-full px-4 py-2 mt-4 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Send
        </button>
      </form>

      <div className="text-red-500 mb-4">{errMessage}</div>

      <div>
        <h1 className="text-2xl">Admin messages</h1>
        <ul className="mt-4">
          {messagesIn.map((mes, index) => (
            <li key={index} className="mb-2">
              <strong className="text-blue-500">admin: </strong>
              {mes.messagesOut}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default User;
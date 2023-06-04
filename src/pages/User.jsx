import React, { useState, useEffect} from 'react';
import { io } from 'socket.io-client';

const socket = io('https://triviadrome.herokuapp.com:3001'); // Replace with your server URL

function User() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [errMessage, setErrMessage] = useState('');
  const [submitted, setSubmitted] = useState(false); // New state variable
  const [allMessages, setAllMessages] = useState([]);
  useEffect(() => {
    const storedUsername = localStorage.getItem('storedUsername');
    if (storedUsername) {
      setUsername(storedUsername);
    }
    console.log(storedUsername);

    socket.on('adminMessageIn', (data) => {
      console.log('Received admin message:', data);
      if (localStorage.getItem('storedUsername') === data.username) {
        const newMessageAdmin = {
          sender: 'Admin',
          content: data.messagesOut
        };
        setAllMessages((prevMessages) => [...prevMessages, newMessageAdmin]);
      }
    });

    socket.on('joinError', (data) => {
      setErrMessage(data);
    });

    return () => {
      socket.off('adminMessageIn');
      socket.off('joinError');
    };
  }, []); // Empty dependency array to run effect only once

  const handleUsernameChange = (event) => {
    
    setUsername(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleMessageChange = (event) => {
    setMessage(event.target.value);
  };

  const handleJoinSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    localStorage.setItem('storedUsername', username);
    socket.emit('getJoinedUsers', username);
  };

  const handleMessageSubmit = (e) => {
    e.preventDefault();
    const newMessage = {
      sender: username,
      content: message
    };
    setAllMessages((prevAllMessages) => [...prevAllMessages, newMessage]);
    socket.emit('userMessage', { username, message });
    setMessage('');
   
  };

 

  const renderJoinForm = () => (
    <form className="mb-4" onSubmit={handleJoinSubmit}>
      <label className="text-lg" htmlFor="username">Username:</label>
      <input className="w-full p-2 border rounded" type="text" id="username"  value={username} onChange={handleUsernameChange}  required />

      <label className="text-lg" htmlFor="email">Email:</label>
      <input className="w-full p-2 border rounded" type="email" id="email" value={email} onChange={handleEmailChange} required />

      <button  className="w-full px-4 py-2 mt-4 bg-blue-500 text-white rounded hover:bg-blue-600" type="submit" >Join</button>
    </form>
  );

  const renderChat = () => (
 
    <div>
      <h2 className="text-2xl mb-4" >Welcome, {localStorage.getItem('storedUsername')}!</h2>
      <form className="mb-4" onSubmit={handleMessageSubmit}>
        <label className="text-lg" htmlFor="message">Message:</label>
        <input  className="w-full p-2 border rounded" type="text"  value={message} onChange={handleMessageChange} required />

        <button  className="w-full px-4 py-2 mt-4 bg-blue-500 text-white rounded hover:bg-blue-600"
         type="submit">Send</button>
      </form>

      <div>
        {errMessage}
      </div>

    
      <h1 className="text-2xl">Messages</h1>
      <div  className="h-80 bg-white overflow-y-auto">
        {allMessages.map((msg, index) => (
          <div key={index} className="message p-2">
            <strong className="sender">{msg.sender}: </strong>
            <span className="content">{msg.content}</span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-5" >
      {submitted ? renderChat() : renderJoinForm()}
    </div>
  );
}


export default User;
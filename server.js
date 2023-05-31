const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');
const app = express();
const server = http.createServer(app);

const PORT = 3001;


const joinedUsers = [];
// Serve the client build folder

app.use(cors({
  origin: 'http://localhost:3000' // Replace with the actual origin of your React app

}));

app.use(express.static('client/build'));

// Handle requests to the root URL
app.get('/', (req, res) => {
  res.sendFile('client/build/index.html', { root: __dirname });
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

const io = require('socket.io')(server, {
  cors: {
    origin: 'http://localhost:3000', // Replace with the actual origin of your React app
    methods: ['GET', 'POST'], // Specify the allowed HTTP methods
    credentials: false, // If you want to allow cookies and other credentials
  },
});

// Socket.IO configuration
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  const id = socket.id;
  
  socket.on('getJoinedUsers', (username) => {
   
    if (joinedUsers.includes(username)){
      socket.emit('joinError', 'Username is already taken');
      return;
    }


      // if (username) {
      //   // Create a user object with username and socket ID
        const user = {
          id: socket.id,
          username: username,
        };

        joinedUsers.push(user);
  
        // Add the user to the list of joined users
       
    io.emit('joinedUsers', joinedUsers);
    console.log(joinedUsers);

  });
//////////////////////////////////////////////////////////
  socket.on('userMessage', (data) => {

    console.log('Received user message:', data);
    const userId = data.username;
    const message = data.message;
    console.log(id);
    console.log(message);
    


    // Emit the message to the admin client
    io.emit('adminMessage', { userId: String(userId), message: String(message) });
  });

  
//////////////////////////////////////////////////////////
  socket.on('adminMessageOut', (data) => {
    console.log('Received admin message:',  data);

    const username = data.userId;
    const messagesOut = data.messagesOut;
    const id = data.id;
  
  

        io.emit('adminMessageIn', data);
      
      
    // Send the message to the selected user

  });


  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
    const index = joinedUsers.indexOf(socket.id);
    if (index !== -1) {
      joinedUsers.splice(index, 1);
    }
  });
});

  // Handle disconnection



// Start the server




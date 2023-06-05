

const express = require('express');
const http = require('http');
const path = require("path");
const cors = require('cors');
const app = express();
const socketIO = require('socket.io');

const PORT = process.env.PORT || 3001;


const joinedUsers = [];
// Serve the client build folder


app.use(cors());


const INDEX = '/index.html';
app.use(express.static(path.resolve(__dirname, "./client/build")))
const server = express()
  .use((req, res) => res.sendFile(INDEX, { root: __dirname }))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

const io = socketIO(server, {
  cors: {
    origin: 'https://triviadrome.herokuapp.com/' ,
    methods: ["GET", "POST"]
  },
  transports: ['websocket', 'polling'],
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


        const user = {
          id: socket.id,
          username: username,
        };

        joinedUsers.push(user);
  
  
       
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
    
    io.emit('adminMessage', { userId: String(userId), message: String(message) });
  });

  
//////////////////////////////////////////////////////////
  socket.on('adminMessageOut', (data) => {
    console.log('Received admin message:',  data);

  

        io.emit('adminMessageIn', data);
      
    

  });


  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
    const index = joinedUsers.indexOf(socket.id);
    if (index !== -1) {
      joinedUsers.splice(index, 1);
    }
  });
});


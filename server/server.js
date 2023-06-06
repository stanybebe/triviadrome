const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const socketIO = require("socket.io");
app.use(cors());

const server = http.createServer(app);



const PORT = process.env.PORT || 3001;


const joinedUsers = [];
// Serve the client build folder






server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});



const io = socketIO(server, {
  cors: {
    origin: 'https://brilliant-arithmetic-e7a72c.netlify.app/' ,
    
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


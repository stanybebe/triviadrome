const express = require('express');
const http = require('http');
const cors = require('cors');
const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 3001;


const joinedUsers = [];
// Serve the client build folder

app.use(cors({
  origin: 'https://triviadrome.herokuapp.com/' // Replace with the actual origin of your React app

}));

app.use(express.static('client/build'));

// Handle requests to the root URL
app.get('/', (req, res) => {
  res.sendFile('client/build/index.html', { root: __dirname });
});

server.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});

const io = require('socket.io')(server);

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


const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const socketIO = require("socket.io");
const path = require("path");


app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  res.setHeader('Content-Security-Policy', "script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'");
  next();
});


const PORT = process.env.PORT || 3001;


const joinedUsers = [];
// Serve the client build folder



const server = http.createServer(app);
const io = socketIO(server,{
  origin: "https://triviadrome.herokuapp.com"
});

// Serve static files from the "public" directory
app.use(express.static('public'));

// Define routes for each HTML page
app.get('/admin', (req, res) => {
  res.sendFile(__dirname + '/public/admin.html');
});

app.get('/home', (req, res) => {
  res.sendFile(__dirname + '/public/home.html');
});

setInterval(() => io.emit('time', new Date().toTimeString()), 1000);
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
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


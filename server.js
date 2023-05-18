const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');
const app = express();
const server = http.createServer(app);

const PORT = 3001;

const activeUsers = {};
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
  socket.on('userMessage', (data) => {
    console.log('Received user message:', data);
    const userId = data.username;
    const message = data.messages;
    console.log(id);
    console.log(message);

    // Store the message for the user
    if (!activeUsers[userId]) {
      activeUsers[userId] = [];
    }
    activeUsers[userId].push(message);

    // Emit the message to the admin client
    io.emit('adminMessage', { userId: String(userId), message: String(message) });
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
  });
});

  // Handle disconnection



// Start the server




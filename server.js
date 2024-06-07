const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server, {
  cors: {
    origin: "https://chatapp-t3il.onrender.com", 
    methods: ["GET", "POST"]
  }
});

app.set('views', './views');
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

const rooms = {};

app.get('/', (req, res) => {
  res.render('index', { rooms: rooms });
});

app.post('/room', (req, res) => {
  if (rooms[req.body.room] != null) {
    return res.redirect('/');
  }
  rooms[req.body.room] = { users: {} };
  res.redirect(req.body.room);
  io.emit('room-created', req.body.room);
});

app.get('/:room', (req, res) => {
  if (rooms[req.params.room] == null) {
    return res.redirect('/');
  }
  res.render('room', { roomName: req.params.room });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

const users = {};

io.on('connection', (socket) => {

  socket.on('new-user', (room, name) => {
    if (!name || !room) {
      return;
    }
    users[socket.id] = { name, room };
    socket.join(room);
    socket.broadcast.to(room).emit('user-connected', name);
  });

  socket.on('send-chat-message', (room, message) => {
    const user = users[socket.id];
    if (!user || user.room !== room) {
      return;
    }
    socket.broadcast.to(room).emit('chat-message', { message: message, name: user.name });
    console.log(`Message from ${user.name} in room ${room}: ${message}`);
  });

  socket.on('disconnect', () => {
    const user = users[socket.id];
    if (user) {
      socket.broadcast.to(user.room).emit('user-disconnected', user.name);
      console.log(`${user.name} disconnected from room ${user.room}`);
      delete users[socket.id];
    } else {
    }
  });
});

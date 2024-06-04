const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server, {
  cors: {
    origin: "https://chatapp-t3il.onrender.com", // Allow your client URL
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
  console.log('New user connected');

  socket.on('new-user', (name) => {
    users[socket.id] = name;
    socket.broadcast.emit('user-connected', name);
    console.log(`${name} connected`);
  });

  socket.on('send-chat-message', (message) => {
    socket.broadcast.emit('chat-message', { message: message, name: users[socket.id] });
    console.log(`Message from ${users[socket.id]}: ${message}`);
  });

  socket.on('disconnect', () => {
    socket.broadcast.emit('user-disconnected', users[socket.id]);
    console.log(`${users[socket.id]} disconnected`);
    delete users[socket.id];
  });
});

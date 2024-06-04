const { io } = require("../server.js")
const socket = io('localhost:3000')
const messageContainer = document.getElementById('message-container')
const messageForm = document.getElementById('send-container')
const messageInput = document.getElementById('message-input')

const name = prompt('What is your name?')
appendMessage('You joined')
socket.emit('new-user', name)

socket.on('chat-message', data => {
  appendMessage(`${data.name}: ${data.message}`)
})

socket.on('user-connected', name => {
  appendMessage(`${name} connected`)
})

socket.on('user-disconnected', name => {
  appendMessage(`${name} disconnected`)
})

messageForm.addEventListener('submit', e => {
  e.preventDefault()
  const message = messageInput.value
  appendMessage(`You: ${message}`)
  socket.emit('send-chat-message', message)
  messageInput.value = ''
})

function appendMessage(message) {
  const messageElement = document.createElement('div')
  messageElement.innerText = message
  messageContainer.append(messageElement)
}

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Chat App</title>
  <script defer src="localhost:3000/socket.io/socket.io.js"></script>
  <script defer src=""></script>
</head>
<body>
  <div id="room-container">
    <!-- låter oss används JavaScript kod direkt i HTML och 
        %> används för att visa slutet av JavaScript delen-->
    <% Object.keys(rooms).forEach(room => { %>
      <div><%= room %></div>
      <a href="/<%= room %>">Join</a>
    <% }) %>
  </div>
  <form action="/room" method="POST">
    <input name="room" type="text" required autocomplete="off">
    <button type="submit">New Room</button>
  </form>
</body>
</html>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Chat App</title>
  <script defer src="localhost:3000/socket.io/socket.io.js"></script>
  <script defer src="script.js"></script>
  <link rel="stylesheet" href="/roomstyle.css">
</head>
<body>
  <div id="message-container"></div>
  <form id="send-container">
    <input type="text" id="message-input" placeholder="Type your message here" autocomplete="off">
    <button type="submit" id="send-button">Send</button>
  </form>
</body>
</html>

const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)

app.set('views', './views')
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))

const rooms = { }

app.get('/', (req, res) => {
  res.render('index', { rooms: rooms })
})

app.post('/room', (req, res) => {
  if (rooms[req.body.room] != null) {
    return res.redirect('/')
  }
  rooms[req.body.room] = { users: {} }
  res.redirect(req.body.room)
  io.emit('room-created', req.body.room)
})

app.get('/:room', (req, res) => {
  if (rooms[req.params.room] == null) {
    return res.redirect('/')
  }
  res.render('room', { roomName: req.params.room })
})


server.listen(3000)

const users = {};

io.on('connection', socket => {
  console.log('New user connected');

  socket.on('new-user', name => {
    users[socket.id] = name;
    socket.broadcast.emit('user-connected', name);
    console.log(`${name} connected`);
  });

  socket.on('send-chat-message', message => {
    socket.broadcast.emit('chat-message', { message: message, name: users[socket.id] });
    console.log(`Message from ${users[socket.id]}: ${message}`);
  });

  socket.on('disconnect', () => {
    socket.broadcast.emit('user-disconnected', users[socket.id]);
    console.log(`${users[socket.id]} disconnected`);
    delete users[socket.id];
  });
});

console.log('Server running at http://localhost:3000');

error: GET localhost:3000/socket.io/socket.io.js net::ERR_UNKNOWN_URL_SCHEME
script.js:1 Uncaught ReferenceError: require is not defined
    at script.js:1:16


optimize code and make it work without any issues

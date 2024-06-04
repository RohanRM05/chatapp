document.addEventListener('DOMContentLoaded', () => {
  const socket = io('https://chatapp-t3il.onrender.com'); // Updated URL
  const messageContainer = document.getElementById('message-container');
  const messageForm = document.getElementById('send-container');
  const messageInput = document.getElementById('message-input');

  if (!messageContainer || !messageForm || !messageInput) {
    console.error('One or more elements not found in the DOM');
    return;
  }

  let name = localStorage.getItem('name');
  if (!name) {
    name = prompt('What is your name?');
    localStorage.setItem('name', name);
  }
  appendMessage('You joined');
  socket.emit('new-user', name);

  socket.on('chat-message', data => {
    appendMessage(`${data.name}: ${data.message}`);
  });

  socket.on('user-connected', name => {
    appendMessage(`${name} connected`);
  });

  socket.on('user-disconnected', name => {
    appendMessage(`${name} disconnected`);
  });

  messageForm.addEventListener('submit', e => {
    e.preventDefault();
    const message = messageInput.value;
    appendMessage(`You: ${message}`);
    socket.emit('send-chat-message', message);
    messageInput.value = '';
  });

  function appendMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageContainer.append(messageElement);
  }
});

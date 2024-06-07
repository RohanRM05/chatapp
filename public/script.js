document.addEventListener('DOMContentLoaded', () => {
  const socket = io('https://chatapp-t3il.onrender.com'); // Updated URL
  const messageContainer = document.getElementById('message-container');
  const messageForm = document.getElementById('send-container');
  const messageInput = document.getElementById('message-input');

  if (!messageContainer || !messageForm || !messageInput) {
    console.error('One or more elements not found in the DOM');
    return;
  }

  const room = window.location.pathname.substring(1);
  let name = prompt('What is your name?');
  if (!name) {
    console.error('No name entered');
    return; // Exit if no name is provided
  }

  appendMessage('You joined');
  socket.emit('new-user', room, name);

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
    const message = messageInput.value.trim();
    if (message === '') {
      console.error('Cannot send an empty message');
      return;
    }
    appendMessage(`You: ${message}`);
    socket.emit('send-chat-message', room, message);
    messageInput.value = '';
  });

  function appendMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageContainer.append(messageElement);
  }
});

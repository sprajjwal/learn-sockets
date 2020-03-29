const socket = io.connect();
const btn = document.getElementById("create-user-btn");
const username = document.getElementById("username-input");
const userForm = document.getElementById('username-form');
const mainContainer = document.querySelector('.main-container');
const usersOnline = document.querySelector('.users-online');
const sendChatBtn = document.getElementById('send-chat-btn');
const messageContainer = document.querySelector('.message-container');

let currentUser;
// Get the online users from the server
socket.emit('get online users');

btn.addEventListener('click', (e)=> {
  if (username.value.length > 0) {
    socket.emit('new user', username.value)
    currentUser = username.value;
    username.value = ""
    mainContainer.style.display = 'flex'
    userForm.style.display = 'none'
  }
})

sendChatBtn.addEventListener('click', (e)=> {
  e.preventDefault();
  let message = document.getElementById('chat-input')
  console.log("message", message.value)
  if(message.value.length > 0){
    // Emit the message with the current user to the server
    socket.emit('new message', {
      sender : currentUser,
      message : message.value,
    });
    message.value = ""
  }
})

// socket listeners
socket.on('new user', (username) => {
  console.log(`✋ ${username} has joined the chat! ✋`);
  usersOnline.innerHTML += `<div class="user-online">${username}</div>`
})

socket.on('new message', (data) => {
  messageContainer.innerHTML += `
    <div class="message">
      <p class="message-user">${data.sender}: </p>
      <p class="message-text">${data.message}</p>
    </div>
  `
})

socket.on('get online users', (onlineUsers) => {
  console.log("getting users")
  for (user in onlineUsers) {
    usersOnline.innerHTML += `<div class="user-online">${user}</div>`
  }
})

//Refresh the online user list
socket.on('user has left', (onlineUsers) => {
  usersOnline.innerHTML = ""
  for (user in onlineUsers) {
    usersOnline.innerHTML += `<div class="user-online">${user}</div>`
  }
});

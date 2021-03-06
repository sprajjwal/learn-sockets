const socket = io.connect();
const btn = document.getElementById("create-user-btn");
const username = document.getElementById("username-input");
const userForm = document.getElementById('username-form');
const mainContainer = document.querySelector('.main-container');
const usersOnline = document.querySelector('.users-online');
const sendChatBtn = document.getElementById('send-chat-btn');
const messageContainer = document.querySelector('.message-container');
const newChannelBtn = document.getElementById('new-channel-btn');
const newChannelInput = document.getElementById('new-channel-input');
const channels = document.querySelector('.channels');
const channelCurrent = document.querySelector('.channel-current')

let currentUser;
// Get the online users from the server
socket.emit('get online users');
//Each user should be in the general channel by default.
socket.emit('user changed channel', "General");

//Users can change the channel by clicking on its name.
$(document).on('click', '.channel', (e)=>{
  let newChannel = e.target.textContent;
  socket.emit('user changed channel', newChannel);
});

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
  let message = document.getElementById('chat-input');
  let currChannel = document.querySelector('.channel-current').textContent
  console.log("message", message.value)
  if(message.value.length > 0){
    // Emit the message with the current user to the server
    socket.emit('new message', {
      sender : currentUser,
      message : message.value,
      channel: currChannel
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
  let currChannel = document.querySelector('.channel-current').textContent
  if (currChannel === data.channel) {
    messageContainer.innerHTML += `
      <div class="message">
        <p class="message-user">${data.sender}: </p>
        <p class="message-text">${data.message}</p>
      </div>
    `
  }
  
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


newChannelBtn.addEventListener('click', (e) => {
  e.preventDefault();
  let channelName = newChannelInput.value;
  if (channelName.length > 0) {
    socket.emit('new channel', channelName);
    newChannelInput.value = "";
  }
})

// Add the new channel to the channels list (Fires for all clients)
socket.on('new channel', (newChannel) => {
  channels.innerHTML += `<div class="channel">${newChannel}</div>`;
});

// Make the channel joined the current channel. Then load the messages.
// This only fires for the client who made the channel.
socket.on('user changed channel', (data) => {
  $('.channel-current').addClass('channel');
  $('.channel-current').removeClass('channel-current');
  $(`.channel:contains('${data.channel}')`).addClass('channel-current');
  $('.channel-current').removeClass('channel');
  $('.message').remove();
  data.messages.forEach((message) => {
    $('.message-container').append(`
      <div class="message">
        <p class="message-user">${message.sender}: </p>
        <p class="message-text">${message.message}</p>
      </div>
    `);
  });
})
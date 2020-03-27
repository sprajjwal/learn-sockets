// index.js
// $(document).ready(()=>{
//   const socket = io.connect();

//   $('#create-user-btn').click((e)=>{
//     e.preventDefault();
//     let username = $('#username-input').val();
//     if(username.length > 0){
//       //Emit to the server the new user
//       socket.emit('new user', username);
//       $('.username-form').remove();
//     }
//   });

// })

const socket = io.connect();
const btn = document.getElementById("create-user-btn");
const username = document.getElementById("username-input");
const userForm = document.getElementById('username-form');

btn.addEventListener('click', (e)=> {
  if (username.value.length > 0) {
    socket.emit('new user', username.value)
    username.value = ""
  }
})

// socket listeners
socket.on('new user', (username) => {
  console.log(`✋ ${username} has joined the chat! ✋`);
})

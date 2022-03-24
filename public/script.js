
const socket = io("ws://localhost:3000");

// send a message to the server
socket.emit("hello from client", 5, "6", { 7: Uint8Array.from([8]) });

// receive a message from the server
socket.on("hello from server", (...args) => {
    console.log('recieved hello from backend: ' + JSON.stringify(args));
  // ...
});

socket.on('new-number', (...args) => {
    console.log('received new number ' + args[0]);

    document.querySelector('#number').innerHTML = args[0];
}); 



console.log('Hello from frontend JS');
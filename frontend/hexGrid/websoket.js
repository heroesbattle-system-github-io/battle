const socket = new WebSocket("ws://localhost:4451/");


console.log(12);

socket.onmessage = (msg) => {
    console.log(msg.data)
}
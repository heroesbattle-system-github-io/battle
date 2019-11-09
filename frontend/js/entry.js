const socket = new WebSocket("ws://localhost:4451");

let gameID = 0;

socket.onmessage = function (event) {
    const incomingMessage = event.data;
    let jsonData = JSON.parse(incomingMessage);
    console.log(incomingMessage)
    if (jsonData["roomID"] !== undefined) {
        gameID = jsonData["roomID"];
        // window.location.href = "file:///home/roman/battle/frontend/views/battle.html";
    }
};



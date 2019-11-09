const socket = new WebSocket("ws://localhost:4451");

let gameID = 0;

socket.onmessage = function (event) {
    const incomingMessage = event.data;
    let jsonData = JSON.parse(incomingMessage);
    console.log(jsonData)
    if (jsonData["roomID"] !== undefined) gameID = jsonData["roomID"];

    if (jsonData["startGame"] !== undefined) {
        if (jsonData["roomID"] == gameID) {
            window.location.replace("file:///home/roman/battle/frontend/views/battle.html")
        }
    }
};

// socket.send('{ "playerId":"32", "yourTurn":"false"}');


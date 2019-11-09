const socket = new WebSocket("ws://localhost:8081");

socket.onmessage = function (event) {
    const incomingMessage = event.data;

    let dataJSON = JSON.parse(incomingMessage);

    console.log(incomingMessage, dataJSON)
};

socket.send('{ "playerId":"32", "yourTurn":"false"}');


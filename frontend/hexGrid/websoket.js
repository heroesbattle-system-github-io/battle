const socket = new WebSocket("ws://localhost:4451/");

let playerData = {
    gameID: -1,
    yourTurn: false,
    playerType: ""
}

_socketHelper.chooseArmyAndSendToWebsoket(socket);

socket.onmessage = (msg) => {
    const message = JSON.parse(msg.data);

    switch (message["message"]) {
        case "start game":
            playerData.gameID = message["roomID"]
            playerData.playerType = message["type"]
            playerData.yourTurn = message["yourTurn"]
            break;

        default:
            break;
    }
    console.log(message)
}
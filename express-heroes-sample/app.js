let WebSocketServer = new require('ws');

const { Client } = require("./classes/Client.class");
const { GameRoom } = require("./classes/GameRoom.class");

let gameRooms = [new GameRoom(1, null, null)];
let clients = [];

var webSocketServer = new WebSocketServer.Server({
  port: 4451
});

function sendStartGame(gameRoom) {
  gameRoom.firstClient.ctx.send(`{"roomID":"${gameRoom.id}"}`);
  gameRoom.secondClient.ctx.send(`{"roomID":"${gameRoom.id}"}`)
}

webSocketServer.on('connection', function (ws) {
  let numberOfClients = clients.length,
    newClientId = numberOfClients + 1,
    client = new Client(ws, newClientId);
  clients.push(client);

  let numberOfGameRooms = gameRooms.length,
    newGameRoomId = numberOfGameRooms + 1;

  let allRoomsBusy = true;

  for (let i = 0; i < gameRooms.length; i++) {
    if (gameRooms[i].firstClient === null && gameRooms[i].secondClient === null) {
      gameRooms[i].firstClient = client;
      allRoomsBusy = false;
    }
    else if (gameRooms[i].firstClient === null && gameRooms[i].secondClient !== null) {
      gameRooms[i].firstClient = client;
      allRoomsBusy = false;
      sendStartGame(gameRooms[i]);
    }
    else if (gameRooms[i].firstClient !== null && gameRooms[i].secondClient === null) {
      gameRooms[i].secondClient = client;
      allRoomsBusy = false;
      sendStartGame(gameRooms[i]);
    }
  }
  if (allRoomsBusy) {
    gameRooms.push(new GameRoom(newGameRoomId, null, null));
    gameRooms[gameRooms.length - 1].firstClient = client;
  }

  // ws.on('message', function (message) {
  //   console.log('receive message ' + message);

  //   for (var key in clients) {
  //     clients[key].send(message);
  //   }
  // });

  ws.on('close', function () {
    
    for (let i = 0; i < clients.length; i++) {
      if (clients[i]["id"] === newClientId) { clients.splice(i, 1); }
    }

    for (let i = 0; i < gameRooms.length; i++) {
      console.log(gameRooms[i]["firstClient"].id, newClientId)
      if (gameRooms[i]["firstClient"].id === newClientId) {
        gameRooms[i]["firstClient"] = null;
      } else if (gameRooms[i]["secondClient"].id === newClientId) {
        gameRooms[i]["secondClient"] = null;
      }
    }
  });

});
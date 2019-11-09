let WebSocketServer = new require('ws');

const { Client } = require("./classes/Client.class");
const { GameRoom } = require("./classes/GameRoom.class");

let gameRooms = [new GameRoom(1, null, null)];
let numberOfClients = 1;
let clients = [];

var webSocketServer = new WebSocketServer.Server({
  port: 4451
});

function someServerCalculationAboutUnit(gameRoom) {
  //some stuff

  gameRoom.firstClient.ctx.send(`{"unitNumber":1}`);
  gameRoom.secondClient.ctx.send(`{"unitNumber":1}`);
}

function sendStartGame(gameRoom) {
  gameRoom.firstClient.ctx.send(`{"roomID":"${gameRoom.id}"}`);
  gameRoom.secondClient.ctx.send(`{"roomID":"${gameRoom.id}"}`);

  gameRoom.firstClient.ctx.send(`{"yourTurn":true}`);
  gameRoom.secondClient.ctx.send(`{"yourTurn":false}`);

  someServerCalculationAboutUnit(gameRoom);
}

webSocketServer.on('connection', function (ws) {
  let clientID = numberOfClients++;
  let client = new Client(ws, clientID);
  clients.push(client);

  let numberOfGameRooms = gameRooms.length,
    newGameRoomId = numberOfGameRooms + 1;

  let allRoomsBusy = true;

  for (let i = 0; i < gameRooms.length; i++) {
    if (gameRooms[i].firstClient === null && gameRooms[i].secondClient === null) {
      gameRooms[i].firstClient = client;
      allRoomsBusy = false;
      break;
    }
    else if (gameRooms[i].firstClient === null && gameRooms[i].secondClient !== null) {
      gameRooms[i].firstClient = client;
      allRoomsBusy = false;
      sendStartGame(gameRooms[i]);
      break;
    }
    else if (gameRooms[i].firstClient !== null && gameRooms[i].secondClient === null) {
      gameRooms[i].secondClient = client;
      allRoomsBusy = false;
      sendStartGame(gameRooms[i]);
      break;
    }
  }
  if (allRoomsBusy) {
    gameRooms.push(new GameRoom(newGameRoomId, null, null));
    gameRooms[gameRooms.length - 1].firstClient = client;
  }

  ws.on('message', function (message) {
   console.log(message)
  });

  ws.on('close', function () {
    for (let i = 0; i < clients.length; i++) {
      if (clients[i]["id"] === clientID) {
        clients.splice(i, 1);
      }
    }

    for (let i = 0; i < gameRooms.length; i++) {

      if (gameRooms[i]["firstClient"] !== null &&
        gameRooms[i]["firstClient"].id === clientID) {

        gameRooms[i]["firstClient"] = null;
      }
      else if (gameRooms[i]["secondClient"] !== null &&
        gameRooms[i]["secondClient"].id === clientID) {

        gameRooms[i]["secondClient"] = null;
      }
    }
  });

});
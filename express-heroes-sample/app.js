let WebSocketServer = new require('ws');

const { Client } = require("./classes/Client.class");
const { GameRoom } = require("./classes/GameRoom.class");
const { _helper } = require("./websocker.helper")

let gameRooms = [new GameRoom(1, null, null, "")];
let numberOfClients = 1;
let clients = [];

var webSocketServer = new WebSocketServer.Server({
  port: 4451
});

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
      _helper.startGame(gameRooms[i]);
      break;
    }
    else if (gameRooms[i].firstClient !== null && gameRooms[i].secondClient === null) {
      gameRooms[i].secondClient = client;
      allRoomsBusy = false;
      _helper.startGame(gameRooms[i]);
      break;
    }
  }

  if (allRoomsBusy) {
    gameRooms.push(new GameRoom(newGameRoomId, null, null, ""));
    gameRooms[gameRooms.length - 1].firstClient = client;
  }

  ws.on('message', function (message) {
    let msgData = JSON.parse(message)

    if (msgData.message === "End Turn") {
      for (let i = 0; i < gameRooms.length; i++) {
        if (gameRooms[i].id === msgData.gameID) {
          if (gameRooms[i].turn === "firstPlayer") gameRooms[i].turn = "secondPlayer"
          else if (gameRooms[i].turn === "secondPlayer") gameRooms[i].turn = "firstPlayer"
          _helper.updateTurnStatus(gameRooms[i])
        }
      }
    }
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
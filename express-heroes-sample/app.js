const WebSocket = require('ws');

const { Client } = require("./classes/Client.class");
const { GameRoom } = require("./classes/GameRoom.class");
const { _helper } = require("./websocker.helper")

const { defaultUnitMapFirstPlayer, defaultUnitMapSecondPlayer } = require('./Unit/unit.class');

let unitOrderFirst = defaultUnitMapFirstPlayer,
  unitOrderSecond = defaultUnitMapSecondPlayer

let gameRooms = [new GameRoom(1, null, null, "")];
let clients = [];
let numberOfClients = 1;

const webSocketServer = new WebSocket.Server({
  port: 4451
});

webSocketServer.on('connection', function (ws) {
  let clientID = numberOfClients++,
    client = new Client(ws, clientID),
    numberOfGameRooms = gameRooms.length,
    newGameRoomId = numberOfGameRooms + 1;

  clients.push(client);

  let data = _helper.putPlayerInGameRoom(
    gameRooms,
    client,
    newGameRoomId,
    unitOrderFirst,
    unitOrderSecond
  );
  
  gameRooms = data.gameRooms

  ws.on('message', function (message) {
    let msgData = JSON.parse(message)

    if (msgData.message === _helper.END_TURN_MESSAGE) {
      for (let i = 0; i < gameRooms.length; i++) {

        if (gameRooms[i].id === msgData.gameID) {
          if (gameRooms[i].turn === "firstPlayer")
            gameRooms[i].turn = "secondPlayer"
          else if (gameRooms[i].turn === "secondPlayer")
            gameRooms[i].turn = "firstPlayer"

          _helper.updateTurnStatus(gameRooms[i]);
          _helper.setUnitMovingOrder(gameRooms[i], unitOrderFirst, unitOrderSecond);
        }

      }
    }

    if (msgData.message === _helper.ATTACK_MONSTER_MESSAGE) {
      for (let i = 0; i < gameRooms.length; i++) {

        if (gameRooms[i].id === msgData.gameID) {
          let type = msgData.type,
            attackerId = msgData.attacker,
            attackTargetId = msgData.attackTarget;

          _helper.processAttackEvent(type, attackerId, attackTargetId, gameRooms[i])
        }

      }
    }
  });

  ws.on('close', function () {
    clients = _helper.removeClientOnCloseEv(clients, clientID)
    gameRooms = _helper.removeClientFromGameRoom(gameRooms, clientID)
  });
});
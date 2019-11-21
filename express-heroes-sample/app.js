const WebSocket = require('ws');

const { Client } = require("./classes/Client.class");
const { GameRoom } = require("./classes/GameRoom.class");
const { _helper } = require("./websocker.helper")

const { infernoUnits, necropolisUnits, dungeonUnits, havenUnits } = require('./Unit/initializeUnit');

let unitOrderFirst = infernoUnits,
  unitOrderSecond = dungeonUnits

let gameRooms = [
  new GameRoom(1,
    null,
    null,
    "",
    JSON.parse(JSON.stringify(unitOrderFirst)),
    JSON.parse(JSON.stringify(unitOrderSecond)))
];

let clients = [];
let numberOfClients = 1;

const webSocketServer = new WebSocket.Server({
  port: 4451
});

webSocketServer.on('connection', function (ws) {
  let clientID = numberOfClients++,
    client = new Client(ws, clientID)

  clients.push(client);

  gameRooms = _helper.putPlayerInGameRoom(gameRooms, client);

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

          let gameRoom = _helper.processAttackEvent(
            type,
            attackerId,
            attackTargetId,
            gameRooms[i],
          );
          gameRooms[i] = gameRoom
        }
      }
    }
  });

  ws.on('close', function (event) {
    let eventCode = event;

    if (eventCode === _helper.BROWSER_LEAVES_PAGE) {
      let rightExit = false
      gameRooms = _helper.removeClientFromGameRoom(gameRooms, clientID, rightExit)
      clients = _helper.removeClientOnCloseEv(clients, clientID)
    }
    else if (eventCode === _helper.NORMAL_SOCKET_CLOSE) {
      let rightExit = true
      gameRooms = _helper.removeClientFromGameRoom(gameRooms, clientID, rightExit)
      clients = _helper.removeClientOnCloseEv(clients, clientID)
    }
  });
});
let WebSocketServer = new require('ws');

const ZERO_IN_ROOM = 0;
const ONE_IN_ROOM = 1;
const TWO_IN_ROOM = 2;

let gameRooms = [ZERO_IN_ROOM];
let clients = {};

var webSocketServer = new WebSocketServer.Server({
  port: 4451
});

webSocketServer.on('connection', function (ws) {
  let roomId = 1,
    allBusyRooms = true,
    startNewGame = false;

  for (let i = 0; i < gameRooms.length; i++) {

    if (gameRooms[i] === ONE_IN_ROOM) {
      roomId = i;
      gameRooms[i]++;
      allBusyRooms = false;
      startNewGame = true;

    } else if (gameRooms[i] !== TWO_IN_ROOM) {
      roomId = i;
      gameRooms[i]++;
      allBusyRooms = false
    }
  }

  if (allBusyRooms) {
    gameRooms.push(ONE_IN_ROOM);
    roomId = gameRooms.length - 1
  }

  const clientId = Object.keys(clients).length + 1;
  clients[clientId] = ws;
  clients[clientId].send(`{"roomID":"${roomId}"}`)
 
  if (startNewGame) {
    for (const key in clients) {
      clients[key].send(`{"startGame":"${true}", "roomID":"${roomId}"}`);
    }
  }

  // ws.on('message', function (message) {
  //   console.log('receive message ' + message);

  //   for (var key in clients) {
  //     clients[key].send(message);
  //   }
  // });

  ws.on('close', function () {
    console.log('closing connection ' + clientId);
    delete clients[clientId];
  });

});
const socket = new WebSocket("ws://localhost:4451/");

let playerData = {
    gameID: -1,
    yourTurn: false,
    playerType: "",
    yourUnitsPosition: [],
    enemyUnitsPostion: []
}

_socketHelper.chooseArmyEvent(_socketHelper.SELECTED_ARMY_CLASS);
_socketHelper.sendArmyToWebsocketServer();

socket.onmessage = (msg) => {
    const message = JSON.parse(msg.data);

    switch (message["message"]) {
        case "start game":
            playerData.gameID = message["roomID"]
            playerData.playerType = message["type"]
            playerData.yourTurn = message["yourTurn"]

            _socketHelper.fadeOutStartGameOverflow()
            setUnitsOnInitialPositions(message["yourArmy"], message["enemyArmy"], playerData.playerType)

            const data = findFriendAndEnemyUnits(playerData.playerType)
            playerData.yourUnitsPosition = [...data.friendlyUnits];
            playerData.enemyUnitsPostion = [...data.enemyUnits];

            break;
        case "set active unit":
            let unitData = {
                moveRange: message["moveRange"],
                unitNumber: message["unitNumber"]
            }
            let hexes = drawActiveUnitHex(playerData, unitData);
            setOnHoverEvent(playerData, unitData, hexes);
            setOnClickEvent(playerData, unitData, hexes)
        default:
            break;
    }
    console.log(message)
}
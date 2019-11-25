const socket = new WebSocket("ws://localhost:4451/");

let playerData = {
    gameID: -1,
    yourTurn: false,
    playerType: "",
    yourUnitsPosition: [],
    enemyUnitsPostion: [],
    yourArmy: [],
    enemyArmy: []
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
            playerData.yourArmy = message["yourArmy"]
            playerData.enemyArmy = message["enemyArmy"]

            _socketHelper.fadeOutStartGameOverflow()
            setUnitsOnInitialPositions(
                playerData.yourArmy,
                playerData.enemyArmy,
                playerData.playerType
            )

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
            setOnClickEvent(playerData, unitData, hexes);

            break;
        case "unit move":
            let animationData = {
                playerTypeUnit: message["playerType"],
                playerType: playerData.playerType,
                unitId: message["unitId"],
                yourArmy: playerData.yourArmy,
                enemyArmy: playerData.enemyArmy
            }
            let dynamicMovePath = [...message["movePath"]],
                stableMovePath = [...message["movePath"]];

            animateUnitWalk(animationData, stableMovePath, dynamicMovePath)

            break;
        default:
            break;
    }
    console.log(message)
}
const socket = new WebSocket("ws://localhost:4451/");

let gameID = undefined,
    yourTurn = false,
    activeUnit = null,
    activeUnitType = "",
    attackTarget = null,
    attacker = null,
    isDiedUnit = false,
    type = "",
    turnTimeout = null,
    activeUnitInfo = "",
    timerInterval = null;

_helper.initUnitsPositionOnScreen()

socket.onmessage = function (event) {
    const incomingMessage = event.data;
    let jsonData = JSON.parse(incomingMessage);
    console.log(jsonData["message"]);

    if (jsonData["message"] === _helper.MSG_START_GAME) {
        gameID = jsonData["roomID"];
        _helper.startGame();
    }

    if (jsonData["message"] === _helper.MSG_PLAYER_TYPE) {
        type = jsonData["type"];
    }

    if (jsonData["message"] === _helper.MSG_TURN_STATUS) {
        yourTurn = jsonData["yourTurn"];

        turnTimeout = _helper.setSkipTurnTimeout();
        timerInterval = _helper.setTimeInterval();

        attackTarget = _helper.setUnitsEventListener(socket, type);
        _helper.setCustomCursorToAttackTarget(type)
    }

    if (jsonData["message"] === _helper.MSG_SET_ACTIVE_UNIT) {
        activeUnit = jsonData["unitNumber"];
        _helper.setActiveUnit(activeUnit, yourTurn);
    }

    if (jsonData["message"] === _helper.MSG_ATTACK_EVENT) {
        clearTimeout(turnTimeout);
        clearInterval(timerInterval);

        damageGiven = jsonData["damage"];

        attacker = jsonData["attacker"];
        attackerType = jsonData["typeAttacker"];

        attackTarget = jsonData["attackTarget"];
        isDiedUnit = jsonData["isDied"];

        _helper.attackAnimation(activeUnit, attackTarget, type);

        if (jsonData["allDied"] === true) {
            let winStatusMessage = attackerType + " win game";

            setTimeout(() => {
                _helper.endGame(winStatusMessage);
                socket.close();
            }, 2300)
        }
    }

    if (jsonData["message"] === _helper.MSG_PLAYER_LEFT_GAME) {
        let winStatusMessage = "Second player surrendered";

        clearTimeout(turnTimeout);
        clearInterval(timerInterval);

        _helper.endGame(winStatusMessage);
        socket.close();
    }
};

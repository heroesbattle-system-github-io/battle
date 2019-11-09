const socket = new WebSocket("ws://localhost:4451/");

let gameID = undefined,
    yourTurn = false,
    activeUnit = null,
    type = "";

_helper.initUnitsPositionOnScreen()

socket.onmessage = function (event) {
    const incomingMessage = event.data;
    let jsonData = JSON.parse(incomingMessage);

    if (jsonData["roomID"] !== undefined) {
        gameID = jsonData["roomID"];
        _helper.startGame();
    }

    if (jsonData["type"] !== undefined) {
        type = jsonData["type"];
        _helper.setUnitsEventListener(type);
    }

    if (jsonData["yourTurn"] !== undefined) {
        yourTurn = jsonData["yourTurn"];
    }

    if (jsonData["unitNumber"] !== undefined) {
        activeUnit = jsonData["unitNumber"];
        startAttackProcesses(activeUnit, yourTurn);
    }
};

function endTurn() {
    socket.send(`{"gameID": ${gameID}, "message":"End Turn"}`)
}

function startAttackProcesses(activeUnit, yourTurn) {
    let activeUnitImg;
    console.log(type, activeUnit, yourTurn)
    if (type === "first" && yourTurn === true) {
        activeUnitImg = document.querySelector(`.unit-first-${activeUnit}`);
    } else if (type === "first" && yourTurn !== true) {
        activeUnitImg = document.querySelector(`.unit-second-${activeUnit}`);
    } else if (type === "second" && yourTurn === true) {
        activeUnitImg = document.querySelector(`.unit-second-${activeUnit}`);
    } else if (type === "second" && yourTurn !== true) {
        activeUnitImg = document.querySelector(`.unit-first-${activeUnit}`);
    }

    activeUnitImg.classList.add("active-unit")
}
const socket = new WebSocket("ws://localhost:4451/");

let gameID = undefined,
    yourTurn = false,
    activeUnit = null,
    activeUnitType = "",
    attackTarget = null,
    attacker = null,
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

    if (jsonData["damage"] !== undefined) {
        damageGiven = jsonData["damage"];
        attacker = jsonData["attacker"];
        attackTarget = jsonData["attackTarget"];
        attackerType = jsonData["typeAttacker"];
        attackAnimation(activeUnit, attackTarget, type);
    }
};

function attackAnimation(attacker, attackTarget, type) {
    let activeUnitImg;

    if (type === "first" && yourTurn === true) {
        activeUnitImg = document.querySelector(`.unit-second-${attackTarget}`);
    } else if (type === "first" && yourTurn !== true) {
        activeUnitImg = document.querySelector(`.unit-first-${attackTarget}`);
    } else if (type === "second" && yourTurn === true) {
        activeUnitImg = document.querySelector(`.unit-first-${attackTarget}`);
    } else if (type === "second" && yourTurn !== true) {
        activeUnitImg = document.querySelector(`.unit-second-${attackTarget}`);
    }

    activeUnitImg.classList.add("attacked")

    setTimeout(() => {
        activeUnitImg.classList.remove("attacked")

        if (type === attackerType) {
            endTurn();
            let images = document.querySelectorAll("#images");
            images.forEach(img => {
                img.classList.remove("active-unit")
            });
        }
    }, 500)
}

function requestForAnimation(target) {

    let attackTargetNumber;
    for (let i = 0; i < target.classList.length; i++) {
        if (target.classList[i].includes("unit-second-") ||
            target.classList[i].includes("unit-first-")) {
            attackTargetNumber = target.classList[i][target.classList[i].length - 1];

            attackTarget = attackTargetNumber
        }
    }

    socket.send(`{
            "gameID": ${gameID},
            "type": "${type}", 
            "attacker": ${activeUnit}, 
            "attackTarget":${attackTargetNumber}, 
            "message":"attackMonster"
        }`)
}

function endTurn() {
    socket.send(`{"gameID": ${gameID}, "message":"End Turn"}`)
}

function startAttackProcesses(activeUnit, yourTurn) {
    let activeUnitImg;

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
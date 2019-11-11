const socket = new WebSocket("ws://localhost:4451/");

let gameID = undefined,
    yourTurn = false,
    activeUnit = null,
    activeUnitType = "",
    attackTarget = null,
    attacker = null,
    isDiedUnit = false,
    type = "";

_helper.initUnitsPositionOnScreen()

socket.onmessage = function (event) {
    const incomingMessage = event.data;
    let jsonData = JSON.parse(incomingMessage);

    if (jsonData["message"] === _helper.MSG_START_GAME) {
        gameID = jsonData["roomID"];
        _helper.startGame();
    }

    if (jsonData["message"] === _helper.MSG_PLAYER_TYPE) {
        type = jsonData["type"];
    }

    if (jsonData["message"] === _helper.MSG_TURN_STATUS) {
        yourTurn = jsonData["yourTurn"];
        attackTarget = _helper.setUnitsEventListener(socket, type);
        _helper.cursorSetter(type)
    }

    if (jsonData["message"] === _helper.MSG_SET_ACTIVE_UNIT) {
        activeUnit = jsonData["unitNumber"];
        startAttackProcesses(activeUnit, yourTurn);
    }

    if (jsonData["message"] === _helper.MSG_ATTACK_EVENT) {
        damageGiven = jsonData["damage"];
        attacker = jsonData["attacker"];
        isDiedUnit = jsonData["isDied"];
        attackTarget = jsonData["attackTarget"];
        attackerType = jsonData["typeAttacker"];

        attackAnimation(activeUnit, attackTarget, type);
    }

    if (jsonData["allDie"] === _helper.MSG_ALL_DIED) {
        let winSTatusMessage = type + " win game";
        setTimeout(() => {
            _helper.endGame(winSTatusMessage);
            socket.close();
        }, 2200)
    }
};

function attackAnimation(attacker, attackTarget, type) {
    let activeUnitImg;

    if (type === "first" && yourTurn === true) {
        activeUnitImg = document.querySelector(`.unit-second-${attackTarget}`);
        healthBar = document.querySelector(`.health-unit-second-${attackTarget}`);
    } else if (type === "first" && yourTurn !== true) {
        activeUnitImg = document.querySelector(`.unit-first-${attackTarget}`);
        healthBar = document.querySelector(`.health-unit-first-${attackTarget}`);
    } else if (type === "second" && yourTurn === true) {
        activeUnitImg = document.querySelector(`.unit-first-${attackTarget}`);
        healthBar = document.querySelector(`.health-unit-first-${attackTarget}`);
    } else if (type === "second" && yourTurn !== true) {
        activeUnitImg = document.querySelector(`.unit-second-${attackTarget}`);
        healthBar = document.querySelector(`.health-unit-second-${attackTarget}`);
    }

    activeUnitImg.classList.add("attacked")
    attackTechno(damageGiven, healthBar, activeUnitImg);
    attackAnimateAnimation();

    setTimeout(() => {
        activeUnitImg.classList.remove("attacked");
        if (isDiedUnit) activeUnitImg.style.visibility = "hidden";
        let images = document.querySelector(".active-unit");
        images.classList.remove("active-unit")

        setTimeout(() => {
            if (type === attackerType) endTurn();
        }, 500);
    }, 2200)
}

function attackTechno(damageGiven, attackTarget, unit) {
    let health = Number(attackTarget.textContent);

    health -= damageGiven;

    attackTarget.textContent = health;
}

function attackAnimateAnimation() {
    let image = document.querySelector(".active-unit");

    let iterator = 0;

    let animation = setInterval(() => {
        let string;
        if (iterator < 10) string = "0" + iterator;
        else string = iterator

        image.style.backgroundImage = `url("../assets/2D_Archer_Spritesheets_1024x1024/Shoot_Stand/shoot_stand_0${string}.png")`;
        iterator++
    }, 100);

    setTimeout(function () { clearInterval(animation); }, 2100);
}

function endTurn() {
    if (type === "first") {
        images = document.querySelectorAll(".unit-second");
    } else if (type === "second") {
        images = document.querySelectorAll(".unit-first");
    }

    images.forEach(image => {
        image.style.cursor = "default";
    });
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
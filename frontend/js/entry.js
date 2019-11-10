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
    console.log(incomingMessage);
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
        isDiedUnit = jsonData["isDied"];
        attackTarget = jsonData["attackTarget"];
        attackerType = jsonData["typeAttacker"];
        attackAnimation(activeUnit, attackTarget, type);
    }

    if (jsonData["allDie"] !== undefined) {
        console.log(type + " win game");
        socket.close();
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
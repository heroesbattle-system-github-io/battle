const socket = new WebSocket("ws://localhost:4451/battle");

let gameID = undefined,
    yourTurn = false,
    activeUnit = null;

socket.onmessage = function (event) {
    const incomingMessage = event.data;
    let jsonData = JSON.parse(incomingMessage);

    if (jsonData["roomID"] !== undefined) {
        gameID = jsonData["roomID"];
        startGame();
    }

    if (jsonData["yourTurn"] !== undefined) {
        yourTurn = jsonData["yourTurn"];
    }

    if (jsonData["unitNumber"] !== undefined) {
        activeUnit = jsonData["unitNumber"];
        startAttackProcesses(activeUnit, yourTurn);
    }
};

let images = document.querySelectorAll("#image");

images.forEach(image => {
    image.addEventListener("mouseover", (ev) => {
        if (yourTurn === false) return;
        image.classList.add("on-hover-image");
    })

    image.addEventListener("mouseleave", (ev) => {
        if (yourTurn === false) return;
        image.classList.remove("on-hover-image");
    })

    image.addEventListener("click", (ev) => {
        if (yourTurn === false) return;
        nextTurn();
    })
});

function nextTurn() {
    socket.send(`{"gameID": ${gameID}, "message":"next turn"}`)
}

function startAttackProcesses(activeUnit, yourTurn) {
    // if (yourTurn === false) return;

    let activeUnitImg = document.querySelector(`.unit-${activeUnit}`);
    console.log(activeUnit)
    activeUnitImg.classList.add("active-unit")
}

function startGame() {
    let overBack = document.querySelector(".overflow-company");
    overBack.classList.add("fadeOut")
}

function initUnitPositions(image, elementPositionedBy) {
    let offset = elementPositionedBy.getBoundingClientRect();
    let centerX = offset.top + offset.width / 2;
    let centerY = offset.left + offset.height / 2;

    image.style.left = centerY - 50 + 'px';
    image.style.top = centerX - 100 + 'px';
}

function initArmy() {
    let imageMap = [
        document.querySelector(".img-1"),
        document.querySelector(".img-2"),
        document.querySelector(".img-3"),
        document.querySelector(".img-4"),
        document.querySelector(".img-5"),

        document.querySelector(".img-1-2"),
        document.querySelector(".img-2-2"),
        document.querySelector(".img-3-2"),
        document.querySelector(".img-4-2"),
        document.querySelector(".img-5-2")
    ]
    let positionMap = [
        document.querySelector('g[transform="translate(-450,-952)"]'),
        document.querySelector('g[transform="translate(-600,-693)"]'),
        document.querySelector('g[transform="translate(-750,-433)"]'),
        document.querySelector('g[transform="translate(-900, -173)"]'),
        document.querySelector('g[transform="translate(-1050, 86)"]'),

        document.querySelector('g[transform="translate(1350, 88)"]'),
        document.querySelector('g[transform="translate(1200, 347)"]'),
        document.querySelector('g[transform="translate(1050, 606)"]'),
        document.querySelector('g[transform="translate(900, 865)"]'),
        document.querySelector('g[transform="translate(750, 1125)"]')
    ]
    for (let i = 0; i < imageMap.length; i++) {
        initUnitPositions(imageMap[i], positionMap[i])
    }
}

initArmy();


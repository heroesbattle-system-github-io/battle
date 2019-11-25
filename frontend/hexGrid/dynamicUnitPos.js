const dynamicLayout = new Layout(Layout.pointy, new Point(35, 35), new Point(0, 0));

let firstPlayerHexes = [
    new Hex(-5, -4, 9),
    new Hex(-6, -2, 8),
    new Hex(-6, -1, 7),
    new Hex(-7, 0, 7),
    new Hex(-8, 2, 6),
    new Hex(-9, 4, 5),
    new Hex(-9, 5, 4)
]

let firstPlayerPositions = [];

for (let i = 0; i < firstPlayerHexes.length; i++) {
    let point = dynamicLayout.hexToPixel(firstPlayerHexes[i])
    point.x -= 30;
    point.y -= 120;
    firstPlayerPositions.push(point)
}

let secondPlayerHexes = [
    new Hex(9, -4, -5),
    new Hex(8, -2, -6),
    new Hex(7, -1, -6),
    new Hex(7, 0, -7),
    new Hex(6, 2, -8),
    new Hex(5, 4, -9),
    new Hex(4, 5, -9)
]

let secondPlayerPositions = [];

for (let i = 0; i < secondPlayerHexes.length; i++) {
    let point = dynamicLayout.hexToPixel(secondPlayerHexes[i])
    point.x -= 45;
    point.y -= 120;
    secondPlayerPositions.push(point)
}

function findFriendAndEnemyUnits(playerType) {
    if (playerType === "first")
        return { friendlyUnits: firstPlayerHexes, enemyUnits: secondPlayerHexes }
    else
        return { friendlyUnits: secondPlayerHexes, enemyUnits: firstPlayerHexes }
}
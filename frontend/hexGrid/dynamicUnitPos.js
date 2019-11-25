let firstPlayerHexes = [
    new Hex(-5, -4, 9),
    new Hex(-6, -2, 8),
    new Hex(-6, -1, 7),
    new Hex(-7, 0, 7),
    new Hex(-8, 2, 6),
    new Hex(-9, 4, 5),
    new Hex(-9, 5, 4)
]

let secondPlayerHexes = [
    new Hex(9, -4, -5),
    new Hex(8, -2, -6),
    new Hex(7, -1, -6),
    new Hex(7, 0, -7),
    new Hex(6, 2, -8),
    new Hex(5, 4, -9),
    new Hex(4, 5, -9)
]

function findFriendAndEnemyUnits(playerType) {
    if (playerType === "first")
        return { friendlyUnits: firstPlayerHexes, enemyUnits: secondPlayerHexes }
    else
        return { friendlyUnits: secondPlayerHexes, enemyUnits: firstPlayerHexes }
}
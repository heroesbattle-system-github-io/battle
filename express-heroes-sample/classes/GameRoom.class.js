class GameRoom {
    constructor(
        id,
        firstClient,
        secondClient,
        turn = "",
        unitOrderFirst,
        unitOrderSecond,
        firstPlayerArmyName = "",
        secondPlayerArmyName = ""
    ) {
        this.id = id;
        this.firstClient = firstClient;
        this.secondClient = secondClient;
        this.turn = turn;
        this.unitOrderFirst = unitOrderFirst;
        this.unitOrderSecond = unitOrderSecond;
        this.firstPlayerArmyName = firstPlayerArmyName;
        this.secondPlayerArmyName = secondPlayerArmyName
    }
}

module.exports = {
    GameRoom: GameRoom
} 
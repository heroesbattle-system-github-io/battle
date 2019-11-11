class GameRoom {
    constructor(id, firstClient, secondClient, turn = "", unitOrderFirst, unitOrderSecond) {
        this.id = id;
        this.firstClient = firstClient;
        this.secondClient = secondClient;
        this.turn = turn;
        this.unitOrderFirst = unitOrderFirst;
        this.unitOrderSecond = unitOrderSecond;
    }
}

module.exports = {
    GameRoom: GameRoom
} 
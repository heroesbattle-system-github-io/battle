class GameRoom {
    constructor(id, firstClient, secondClient, turn = "") {
        this.id = id;
        this.firstClient = firstClient;
        this.secondClient = secondClient;
        this.turn = turn
    }
}

module.exports = {
    GameRoom: GameRoom
} 
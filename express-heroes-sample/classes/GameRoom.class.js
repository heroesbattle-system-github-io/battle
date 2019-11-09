class GameRoom {
    constructor(id, firstClient, secondClient) {
        this.id = id;
        this.firstClient = firstClient;
        this.secondClient = secondClient
    }
}

module.exports = {
    GameRoom: GameRoom
} 
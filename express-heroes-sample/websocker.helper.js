const _helper = {
    FIRST_PLAYER_TURN: "firstPlayer",
    SECOND_PLAYER_TURN: "secondPlayer",

    YOUR_TURN_TRUE_JSON: '{"yourTurn":true}',
    YOUR_TURN_FALSE_JSON: '{"yourTurn":false}',

    updateTurnStatus(gameRoom) {
        if (gameRoom.turn === this.FIRST_PLAYER_TURN) {
            gameRoom.firstClient.ctx.send(this.YOUR_TURN_TRUE_JSON);
            gameRoom.secondClient.ctx.send(this.YOUR_TURN_FALSE_JSON);
        }
        else if (gameRoom.turn === this.SECOND_PLAYER_TURN) {
            gameRoom.firstClient.ctx.send(this.YOUR_TURN_FALSE_JSON);
            gameRoom.secondClient.ctx.send(this.YOUR_TURN_TRUE_JSON);
        }
    },

    setUnitMovingOrder(gameRoom) {
        //calculate move order
        let unitMoveId = Math.floor(Math.random() * 5) + 1

        gameRoom.firstClient.ctx.send(`{"unitNumber":${unitMoveId}}`);
        gameRoom.secondClient.ctx.send(`{"unitNumber":${unitMoveId}}`);
    },

    startGame(gameRoom) {
        gameRoom.firstClient.ctx.send(`{"roomID":"${gameRoom.id}"}`);
        gameRoom.secondClient.ctx.send(`{"roomID":"${gameRoom.id}"}`);
        gameRoom.turn = this.FIRST_PLAYER_TURN;

        this.updateTurnStatus(gameRoom)
        this.setUnitMovingOrder(gameRoom);
    }
}

module.exports = {
    _helper: _helper
}
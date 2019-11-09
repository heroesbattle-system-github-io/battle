const _helper = {
    FIRST_PLAYER_TURN: "firstPlayer",
    SECOND_PLAYER_TURN: "secondPlayer",

    YOUR_TURN_TRUE_JSON: '{"yourTurn":true}',
    YOUR_TURN_FALSE_JSON: '{"yourTurn":false}',

    PLAYER_FIRST_TYPE_JSON: '{"type":"first"}',
    PLAYER_SECOND_TYPE_JSON: '{"type":"second"}',

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

        this.sendPlayerHisType(gameRoom);
        this.updateTurnStatus(gameRoom);
        this.setUnitMovingOrder(gameRoom);
    },

    sendPlayerHisType(gameRoom) {
        gameRoom.firstClient.ctx.send(this.PLAYER_FIRST_TYPE_JSON);
        gameRoom.secondClient.ctx.send(this.PLAYER_SECOND_TYPE_JSON);
    }
}

module.exports = {
    _helper: _helper
}
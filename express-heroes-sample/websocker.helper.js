const _helper = {
    FIRST_PLAYER_TURN: "firstPlayer",
    SECOND_PLAYER_TURN: "secondPlayer",

    YOUR_TURN_TRUE_JSON: '{"yourTurn":true}',
    YOUR_TURN_FALSE_JSON: '{"yourTurn":false}',

    PLAYER_FIRST_TYPE_JSON: '{"type":"first"}',
    PLAYER_SECOND_TYPE_JSON: '{"type":"second"}',

    END_TURN_MESSAGE: "End Turn",
    ATTACK_MONSTER_MESSAGE: "attackMonster",

    putPlayerInGameRoom(gameRooms, client, newGameRoomId) {
        let allRoomsBusy = true;

        for (let i = 0; i < gameRooms.length; i++) {
            if (gameRooms[i].firstClient === null && gameRooms[i].secondClient === null) {
                gameRooms[i].firstClient = client;
                allRoomsBusy = false;
                break;
            }
            else if (gameRooms[i].firstClient === null && gameRooms[i].secondClient !== null) {
                gameRooms[i].firstClient = client;
                allRoomsBusy = false;
                this.startGame(gameRooms[i]);
                break;
            }
            else if (gameRooms[i].firstClient !== null && gameRooms[i].secondClient === null) {
                gameRooms[i].secondClient = client;
                allRoomsBusy = false;
                this.startGame(gameRooms[i]);
                break;
            }
        }

        if (allRoomsBusy) {
            gameRooms.push(new GameRoom(newGameRoomId, null, null, ""));
            gameRooms[gameRooms.length - 1].firstClient = client;
        }

        return gameRooms;
    },

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
    },

    processAttackEvent(type, attackerId, attackTargetId, gameRoom) {
        // some calculation
        console.log(type);
        gameRoom.firstClient.ctx.send(`{
            "damage":${12},
            "attacker": ${attackerId}, 
            "attackTarget":${attackTargetId},
            "typeAttacker":"${type}"
        }`);

        gameRoom.secondClient.ctx.send(`{
            "damage":${12},
            "attacker": ${attackerId}, 
            "attackTarget":${attackTargetId},
            "typeAttacker":"${type}"
        }`);
    },

    removeClientOnCloseEv(clients, clientID) {
        for (let i = 0; i < clients.length; i++) {
            if (clients[i]["id"] === clientID) {
                clients.splice(i, 1);
            }
        }

        return clients
    },

    removeClientFromGameRoom(gameRooms, clientID) {
        for (let i = 0; i < gameRooms.length; i++) {

            if (gameRooms[i]["firstClient"] !== null &&
                gameRooms[i]["firstClient"].id === clientID) {

                gameRooms[i]["firstClient"] = null;
            }
            else if (gameRooms[i]["secondClient"] !== null &&
                gameRooms[i]["secondClient"].id === clientID) {

                gameRooms[i]["secondClient"] = null;
            }
        }

        return gameRooms
    }
}

module.exports = {
    _helper: _helper
}
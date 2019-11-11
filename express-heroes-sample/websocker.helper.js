const { GameRoom } = require("./classes/GameRoom.class");
const { defaultUnitMapFirstPlayer, defaultUnitMapSecondPlayer } = require('./Unit/unit.class');

const _helper = {
    FIRST_PLAYER_TURN: "firstPlayer",
    SECOND_PLAYER_TURN: "secondPlayer",

    FIRST_PLAYER_TYPE: "first",
    SECOND_PLAYER_TYPE: "second",

    YOUR_TURN_TRUE_JSON: '{"message":"turn status", "yourTurn":true}',
    YOUR_TURN_FALSE_JSON: '{"message":"turn status", "yourTurn":false}',

    PLAYER_FIRST_TYPE_JSON: '{"message":"player type", "type":"first"}',
    PLAYER_SECOND_TYPE_JSON: '{"message":"player type", "type":"second"}',

    END_TURN_MESSAGE: "End Turn",
    ATTACK_MONSTER_MESSAGE: "attackMonster",

    sendSocketMessageToPlayers(gameRoom, msg) {
        gameRoom.firstClient.ctx.send(msg);
        gameRoom.secondClient.ctx.send(msg);
    },

    putPlayerInGameRoom(gameRooms, player) {
        let allGameRoomsBusy = true;

        for (let i = 0; i < gameRooms.length; i++) {
            let gameRoom = gameRooms[i];

            if (gameRoom.firstClient === null && gameRoom.secondClient === null) {
                gameRoom.firstClient = player;
                allGameRoomsBusy = false;
                break;
            }
            else if (gameRoom.firstClient === null && gameRoom.secondClient !== null) {
                gameRoom.firstClient = player;
                allGameRoomsBusy = false;

                gameRoom = this.startGame(gameRoom);
                gameRooms[i] = gameRoom
            }
            else if (gameRoom.firstClient !== null && gameRoom.secondClient === null) {
                gameRoom.secondClient = player;
                allGameRoomsBusy = false;

                gameRoom = this.startGame(gameRoom);
                gameRooms[i] = gameRoom
            }
        }

        if (allGameRoomsBusy) {
            let newGameRoomId = gameRooms.length + 1
            gameRooms.push(new GameRoom(
                newGameRoomId, null, null, "",
                JSON.parse(JSON.stringify(defaultUnitMapFirstPlayer)),
                JSON.parse(JSON.stringify(defaultUnitMapSecondPlayer))));

            gameRooms[gameRooms.length - 1].firstClient = player;
        }

        return gameRooms
    },

    startGame(gameRoom) {
        const startGameMessage = `{"message":"start game", "roomID":"${gameRoom.id}"}`;
        this.sendSocketMessageToPlayers(gameRoom, startGameMessage)

        gameRoom.turn = this.SECOND_PLAYER_TURN;

        this.sendPlayerHisType(gameRoom);
        this.updateTurnStatus(gameRoom);
        return this.setUnitMovingOrder(gameRoom);
    },

    sendPlayerHisType(gameRoom) {
        gameRoom.firstClient.ctx.send(this.PLAYER_FIRST_TYPE_JSON);
        gameRoom.secondClient.ctx.send(this.PLAYER_SECOND_TYPE_JSON);
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
        let maxInitiative, unitKey
        if (gameRoom.turn === this.SECOND_PLAYER_TURN) {
            let unitData = this.findMaxInitiativeUnit(gameRoom.unitOrderSecond);
            maxInitiative = unitData.maxInitiative;
            unitKey = unitData.unitKey

            if (maxInitiative === 0) {
                for (const key in gameRoom.unitOrderSecond)
                    gameRoom.unitOrderSecond[key].was = false;

                unitData = this.findMaxInitiativeUnit(gameRoom.unitOrderSecond);
                maxInitiative = unitData.maxInitiative;
                unitKey = unitData.unitKey
            }
            gameRoom.unitOrderSecond[unitKey].was = true
        }
        else if (gameRoom.turn === this.FIRST_PLAYER_TURN) {
            let unitData = this.findMaxInitiativeUnit(gameRoom.unitOrderFirst);
            maxInitiative = unitData.maxInitiative;
            unitKey = unitData.unitKey

            if (maxInitiative === 0) {
                for (const key in gameRoom.unitOrderFirst)
                    gameRoom.unitOrderFirst[key].was = false;

                unitData = this.findMaxInitiativeUnit(gameRoom.unitOrderFirst);
                maxInitiative = unitData.maxInitiative;
                unitKey = unitData.unitKey
            }
            gameRoom.unitOrderFirst[unitKey].was = true
        }

        let unitMoveId = unitKey[unitKey.length - 1]

        const setActiveUnit = `{"message":"set active unit", "unitNumber":${unitMoveId}}`;
        this.sendSocketMessageToPlayers(gameRoom, setActiveUnit)

        return gameRoom
    },

    findMaxInitiativeUnit(unitsOrder) {
        let maxInitiative = 0, unitKey;
        for (const key in unitsOrder) {
            if (unitsOrder[key].initiative > maxInitiative &&
                unitsOrder[key].was !== true &&
                unitsOrder[key].isDied !== true) {
                maxInitiative = unitsOrder[key].initiative;
                unitKey = key
            }
        }

        return { maxInitiative, unitKey }
    },
 
    processAttackEvent(type, attackerId, attackTargetId, gameRoom) {
        let attacker = null,
            attackTarget = null;

        if (type === this.SECOND_PLAYER_TYPE) {
            attacker = gameRoom.unitOrderSecond["unit-second-" + attackerId];
            attackTarget = gameRoom.unitOrderFirst["unit-first-" + attackTargetId]
        } else if (type === this.FIRST_PLAYER_TYPE) {
            attacker = gameRoom.unitOrderFirst["unit-first-" + attackerId];
            attackTarget = gameRoom.unitOrderSecond["unit-second-" + attackTargetId];
        }

        let damage = attacker.amountInStack * attacker.maxDamage * (attacker.attack / attackTarget.defence);
        let killUnits = Math.round(damage / attackTarget.health);
        if (killUnits === 0) killUnits = 1;

        let isDied = false;
        if (type === this.SECOND_PLAYER_TYPE) {
            gameRoom.unitOrderFirst["unit-first-" + String(attackTargetId)].amountInStack -= killUnits;
            if (gameRoom.unitOrderFirst["unit-first-" + attackTargetId].amountInStack <= 0) {
                gameRoom.unitOrderFirst["unit-first-" + attackTargetId].isDied = true;
                isDied = true;

                let allDied = this.isAllUnitsDied(gameRoom.unitOrderFirst)
                if (allDied) {
                    const allDiedMsg = `{
                        "message":"all died", 
                        "allDie": ${allDied},
                        "typeThatDie":"${type}"
                    }`;
                    this.sendSocketMessageToPlayers(gameRoom, allDiedMsg)

                    return gameRoom
                }
            }
        } else if (type === this.FIRST_PLAYER_TYPE) {
            gameRoom.unitOrderSecond["unit-second-" + String(attackTargetId)].amountInStack -= killUnits;
            if (gameRoom.unitOrderSecond["unit-second-" + attackTargetId].amountInStack <= 0) {
                gameRoom.unitOrderSecond["unit-second-" + attackTargetId].isDied = true;
                isDied = true;

                let allDied = this.isAllUnitsDied(gameRoom.unitOrderSecond);
                if (allDied) {
                    const allDiedMsg = `{
                        "message":"all died", 
                        "allDie": ${allDied},
                        "typeThatDie":"${type}"
                    }`;
                    this.sendSocketMessageToPlayers(gameRoom, allDiedMsg)

                    return gameRoom.unitOrderSecond
                }
            }
        }
        const attackEvent = `{
            "message":"attack event",
            "damage":${killUnits},
            "attacker": ${attackerId}, 
            "attackTarget":${attackTargetId},
            "typeAttacker":"${type}",
            "isDied":${isDied}
        }`;
        this.sendSocketMessageToPlayers(gameRoom, attackEvent)

        return gameRoom
    },

    isAllUnitsDied(unitsOrder) {
        let allDied = true;
        for (const key in unitsOrder) {
            if (!unitsOrder[key].isDied) allDied = false;
        }
        return allDied
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
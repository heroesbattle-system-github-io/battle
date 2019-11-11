const { GameRoom } = require("./classes/GameRoom.class");

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

    putPlayerInGameRoom(gameRooms, player, unitOrderFirst, unitOrderSecond) {
        let allGameRoomsBusy = true;

        for (let i = 0; i < gameRooms.length; i++) {
            const gameRoom = gameRooms[i];

            if (gameRoom.firstClient === null && gameRoom.secondClient === null) {
                gameRoom.firstClient = player;
                allGameRoomsBusy = false;
                break;
            }
            else if (gameRoom.firstClient === null && gameRoom.secondClient !== null) {
                gameRoom.firstClient = player;
                allGameRoomsBusy = false;
                return this.startGame(gameRoom, unitOrderFirst, unitOrderSecond, gameRooms);
            }
            else if (gameRoom.firstClient !== null && gameRoom.secondClient === null) {
                gameRoom.secondClient = player;
                allGameRoomsBusy = false;
                return this.startGame(gameRoom, unitOrderFirst, unitOrderSecond, gameRooms);
            }
        }

        if (allGameRoomsBusy) {
            let newGameRoomId = gameRooms.length + 1
            gameRooms.push(new GameRoom(newGameRoomId, null, null, ""));
            gameRooms[gameRooms.length - 1].firstClient = player;
        }

        return { unitOrderFirst, unitOrderSecond, gameRooms };
    },

    startGame(gameRoom, unitOrderFirst, unitOrderSecond, gameRooms) {
        const startGameMessage = `{"message":"start game", "roomID":"${gameRoom.id}"}`;
        this.sendSocketMessageToPlayers(gameRoom, startGameMessage)

        gameRoom.turn = this.SECOND_PLAYER_TURN;

        this.sendPlayerHisType(gameRoom);
        this.updateTurnStatus(gameRoom);

        let units = this.setUnitMovingOrder(gameRoom, unitOrderFirst, unitOrderSecond);
        let unitsFirstPlayer = units.unitOrderFirst,
            unitsSecondPlayer = units.unitOrderSecond;

        return { unitsFirstPlayer, unitsSecondPlayer, gameRooms }
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

    setUnitMovingOrder(gameRoom, unitOrderFirst, unitOrderSecond) {
        let maxInitiative, unitKey
        if (gameRoom.turn === this.SECOND_PLAYER_TURN) {
            let unitData = this.findMaxInitiativeUnit(unitOrderSecond);
            maxInitiative = unitData.maxInitiative;
            unitKey = unitData.unitKey

            if (maxInitiative === 0) {
                for (const key in unitOrderSecond) unitOrderSecond[key].was = false;

                unitData = this.findMaxInitiativeUnit(unitOrderSecond);
                maxInitiative = unitData.maxInitiative;
                unitKey = unitData.unitKey
            }
            unitOrderSecond[unitKey].was = true
        }
        else if (gameRoom.turn === this.FIRST_PLAYER_TURN) {
            let unitData = this.findMaxInitiativeUnit(unitOrderFirst);
            maxInitiative = unitData.maxInitiative;
            unitKey = unitData.unitKey

            if (maxInitiative === 0) {
                for (const key in unitOrderFirst) unitOrderFirst[key].was = false;

                unitData = this.findMaxInitiativeUnit(unitOrderFirst);
                maxInitiative = unitData.maxInitiative;
                unitKey = unitData.unitKey
            }
            unitOrderFirst[unitKey].was = true
        }

        let unitMoveId = unitKey[unitKey.length - 1]

        const setActiveUnit = `{"message":"set active unit", "unitNumber":${unitMoveId}}`;
        this.sendSocketMessageToPlayers(gameRoom, setActiveUnit)

        return { unitOrderFirst, unitOrderSecond }
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

    processAttackEvent(type, attackerId, attackTargetId, gameRoom, unitOrderFirst, unitOrderSecond) {
        let attacker = null,
            attackTarget = null;

        if (type === this.SECOND_PLAYER_TYPE) {
            attacker = unitOrderSecond["unit-second-" + attackerId];
            attackTarget = unitOrderFirst["unit-first-" + attackTargetId]
        } else if (type === this.FIRST_PLAYER_TYPE) {
            attacker = unitOrderFirst["unit-first-" + attackerId];
            attackTarget = unitOrderSecond["unit-second-" + attackTargetId];
        }

        let damage = attacker.amountInStack * attacker.maxDamage * (attacker.attack / attackTarget.defence);
        let killUnits = Math.round(damage / attackTarget.health);
        if (killUnits === 0) killUnits = 1;

        let isDied = false;
        if (type === this.SECOND_PLAYER_TYPE) {
            unitOrderFirst["unit-first-" + String(attackTargetId)].amountInStack -= killUnits;
            if (unitOrderFirst["unit-first-" + attackTargetId].amountInStack <= 0) {
                unitOrderFirst["unit-first-" + attackTargetId].isDied = true;
                isDied = true;

                if (this.isAllUnitsDied(unitOrderFirst)) {
                    const allDiedMsg = `{
                        "message":"all died", 
                        "allDie": ${allDied},
                        "typeThatDie":"${type}"
                    }`;
                    this.sendSocketMessageToPlayers(gameRoom, allDiedMsg)

                    return { unitOrderFirst, unitOrderSecond }
                }
            }
        } else if (type === this.FIRST_PLAYER_TYPE) {
            unitOrderSecond["unit-second-" + String(attackTargetId)].amountInStack -= killUnits;
            if (unitOrderSecond["unit-second-" + attackTargetId].amountInStack <= 0) {
                unitOrderSecond["unit-second-" + attackTargetId].isDied = true;
                isDied = true;

                if (this.isAllUnitsDied(unitOrderSecond)) {
                    const allDiedMsg = `{
                        "message":"all died", 
                        "allDie": ${allDied},
                        "typeThatDie":"${type}"
                    }`;
                    this.sendSocketMessageToPlayers(gameRoom, allDiedMsg)

                    return { unitOrderFirst, unitOrderSecond }
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

        return { unitOrderFirst, unitOrderSecond }
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
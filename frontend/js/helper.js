const _helper = {
    MSG_START_GAME: "start game",
    MSG_PLAYER_TYPE: "player type",
    MSG_TURN_STATUS: "turn status",
    MSG_SET_ACTIVE_UNIT: "set active unit",
    MSG_ATTACK_EVENT: "attack event",
    MSG_ALL_DIED: "all died",
    MSG_PLAYER_LEFT_GAME: "left game",

    FIRST_PLAYER: "first",
    SECOND_PLAYER: "second",

    UNITS_FIRST_PLAYER_SELECTOR: ".unit-first",
    UNITS_SECOND_PLAYER_SELECTOR: ".unit-second",
    ACTIVE_UNIT_CLASSNAME: "active-unit",

    CUSTOM_CURSOR: `url("../assets/attack.cur"), default`,

    SOCKET_LOADING_TIME_MS: 100,
    ONE_SECOND_MS: 1000,
    ONE_MINUTE_AND_ONE_SECOND_MS: 61000,
    SECONDS_ON_TURN: 59,
    TEN_SECONDS: 10,

    ONE_MINUTE: "01:00",
    LESS_THEN_TEN_SECONDS: "00:0",
    MORE_THEN_TEN_SECONDS: "00:",

    initialUnitsPositionsOnScreen: [
        document.querySelector('g[transform="translate(-450,-952)"]'),
        document.querySelector('g[transform="translate(-600,-693)"]'),
        document.querySelector('g[transform="translate(-750,-433)"]'),
        document.querySelector('g[transform="translate(-900, -173)"]'),
        document.querySelector('g[transform="translate(-1050, 86)"]'),

        document.querySelector('g[transform="translate(1350, 88)"]'),
        document.querySelector('g[transform="translate(1200, 347)"]'),
        document.querySelector('g[transform="translate(1050, 606)"]'),
        document.querySelector('g[transform="translate(900, 865)"]'),
        document.querySelector('g[transform="translate(750, 1125)"]')
    ],

    unitDOMElementNames: [
        document.querySelector(".unit-first-1"),
        document.querySelector(".unit-first-2"),
        document.querySelector(".unit-first-3"),
        document.querySelector(".unit-first-4"),
        document.querySelector(".unit-first-5"),

        document.querySelector(".unit-second-1"),
        document.querySelector(".unit-second-2"),
        document.querySelector(".unit-second-3"),
        document.querySelector(".unit-second-4"),
        document.querySelector(".unit-second-5")
    ],

    unitHealthBarNames: [
        document.querySelector(".health-unit-first-1"),
        document.querySelector(".health-unit-first-2"),
        document.querySelector(".health-unit-first-3"),
        document.querySelector(".health-unit-first-4"),
        document.querySelector(".health-unit-first-5"),

        document.querySelector(".health-unit-second-1"),
        document.querySelector(".health-unit-second-2"),
        document.querySelector(".health-unit-second-3"),
        document.querySelector(".health-unit-second-4"),
        document.querySelector(".health-unit-second-5")
    ],

    startGame() {
        const waitOverflowBackground = document.querySelector(".wait-overflow");
        waitOverflowBackground.classList.add("fadeOut")
    },

    setUnitsEventListener(socket, playerType) {
        let images = null;

        if (playerType === this.FIRST_PLAYER)
            images = document.querySelectorAll(this.UNITS_SECOND_PLAYER_SELECTOR);
        else if (playerType === this.SECOND_PLAYER)
            images = document.querySelectorAll(this.UNITS_FIRST_PLAYER_SELECTOR);

        images.forEach(image => {
            image.addEventListener("click", this.clickUnitHandler)
        });
    },

    clickUnitHandler(ev) {
        if (yourTurn === false) return;
        ev.target.removeEventListener("click", _helper.clickUnitHandler);
        _helper.requestToAttack(ev.target)
    },

    requestToAttack(target) {
        const targetNames = target.classList;

        for (let i = 0; i < targetNames.length; i++) {
            if (targetNames[i].includes("unit-second-") ||
                targetNames[i].includes("unit-first-")) {
                let attackTargetIDPosition = targetNames[i].length - 1;
                let attackTargetID = targetNames[i][attackTargetIDPosition];

                attackTarget = attackTargetID
            }
        }

        socket.send(`{
                "gameID": ${gameID},
                "type": "${type}", 
                "attacker": ${activeUnit}, 
                "attackTarget":${attackTarget}, 
                "message":"attackMonster"
            }`)
    },

    setCustomCursorToAttackTarget(playerType) {
        let images = null;
        if (playerType === this.FIRST_PLAYER) {
            images = document.querySelectorAll(this.UNITS_SECOND_PLAYER_SELECTOR);
        } else if (playerType === this.SECOND_PLAYER) {
            images = document.querySelectorAll(this.UNITS_FIRST_PLAYER_SELECTOR);
        }

        images.forEach(image => {
            if (yourTurn === true) image.style.cursor = this.CUSTOM_CURSOR
        });
    },

    setActiveUnit(activeUnit, yourTurn) {
        let activeUnitImg;

        if (type === this.FIRST_PLAYER && yourTurn === true)
            activeUnitImg = document.querySelector(`.unit-first-${activeUnit}`);
        else if (type === this.FIRST_PLAYER && yourTurn !== true)
            activeUnitImg = document.querySelector(`.unit-second-${activeUnit}`);
        else if (type === this.SECOND_PLAYER && yourTurn === true)
            activeUnitImg = document.querySelector(`.unit-second-${activeUnit}`);
        else if (type === this.SECOND_PLAYER && yourTurn !== true)
            activeUnitImg = document.querySelector(`.unit-first-${activeUnit}`);

        activeUnitImg.classList.add("active-unit")
    },

    attackAnimation(attacker, attackTarget, type) {
        let battleAnimationOverflow = document.querySelector(".attack-animition-overflow");
        battleAnimationOverflow.classList.add("fadeIn");

        let attackTargetUnit;

        if (type === this.FIRST_PLAYER && yourTurn === true) {
            attackTargetUnit = document.querySelector(`.unit-second-${attackTarget}`);
            healthBar = document.querySelector(`.health-unit-second-${attackTarget}`);
        } else if (type === this.FIRST_PLAYER && yourTurn !== true) {
            attackTargetUnit = document.querySelector(`.unit-first-${attackTarget}`);
            healthBar = document.querySelector(`.health-unit-first-${attackTarget}`);
        } else if (type === this.SECOND_PLAYER && yourTurn === true) {
            attackTargetUnit = document.querySelector(`.unit-first-${attackTarget}`);
            healthBar = document.querySelector(`.health-unit-first-${attackTarget}`);
        } else if (type === this.SECOND_PLAYER && yourTurn !== true) {
            attackTargetUnit = document.querySelector(`.unit-second-${attackTarget}`);
            healthBar = document.querySelector(`.health-unit-second-${attackTarget}`);
        }
        attackTargetUnit.classList.add("attacked");

        this.setHealthAfterGetDamage(damageGiven, healthBar);
        this.executeAttackAnimation(healthBar);

        setTimeout(() => {
            attackTargetUnit.classList.remove("attacked");
            if (isDiedUnit) attackTargetUnit.style.visibility = "hidden";
            let images = document.querySelector(".active-unit");
            images.classList.remove("active-unit")

            setTimeout(() => {
                if (type === attackerType) this.endTurn(battleAnimationOverflow);
                battleAnimationOverflow.classList.remove("fadeIn");
            }, 200);
        }, 2250)
    },

    setHealthAfterGetDamage(damageGiven, healthBar) {
        let health = Number(healthBar.textContent);

        health -= damageGiven;

        healthBar.classList.add("fadeOut");
        healthBar.textContent = health;
    },

    executeAttackAnimation(healthBar) {
        let activeUnit = document.querySelector(".active-unit");
        let iterator = 0;

        let animation = setInterval(() => {
            let string;
            if (iterator < 10) string = "0" + iterator;
            else string = iterator

            activeUnit.style.backgroundImage = `url("../assets/2D_Archer_Spritesheets_1024x1024/Shoot_Stand/shoot_stand_0${string}.png")`;
            iterator++
        }, 100);

        setTimeout(function () {
            clearInterval(animation);

            if (Number(healthBar.textContent) > 0)
                healthBar.classList.remove("fadeOut")
        }, 2200);
    },

    endTurn() {
        if (type === this.FIRST_PLAYER)
            images = document.querySelectorAll(".unit-second");
        else if (type === this.SECOND_PLAYER)
            images = document.querySelectorAll(".unit-first");

        images.forEach(image => {
            image.style.cursor = "default";
            image.removeEventListener("click", this.clickUnitHandler);
        });

        socket.send(`{"gameID": ${gameID}, "message":"End Turn"}`)
    },

    timeOutEndTurn(type) {
        if (type === this.FIRST_PLAYER)
            images = document.querySelectorAll(".unit-second");
        else if (type === this.SECOND_PLAYER)
            images = document.querySelectorAll(".unit-first");

        images.forEach(image => {
            image.style.cursor = "default";
            image.removeEventListener("click", this.clickUnitHandler);
        });

        socket.send(`{"gameID": ${gameID}, "message":"End Turn"}`);
    },

    initUnitPositionOnScreen(image, elementPositionedBy, healthBar) {
        let offset = elementPositionedBy.getBoundingClientRect();
        let centerX = offset.top + offset.width / 2;
        let centerY = offset.left + offset.height / 2;

        image.style.left = centerY - 40 + 'px';
        image.style.top = centerX - 80 + 'px';

        healthBar.style.left = centerY - 25 + 'px';
        healthBar.style.top = image.offsetTop + image.offsetHeight - 14 + 'px';
    },

    initUnitsPositionOnScreen() {
        for (let i = 0; i < this.initialUnitsPositionsOnScreen.length; i++) {
            this.initUnitPositionOnScreen(
                this.unitDOMElementNames[i],
                this.initialUnitsPositionsOnScreen[i],
                this.unitHealthBarNames[i]
            )
        }
    },

    endGame(msg) {
        let winInfo = document.querySelector(".win-overflow__status");
        winInfo.textContent = msg;

        let overBack = document.querySelector(".win-overflow");
        overBack.classList.add("fadeIn");
    },

    setTimeInterval() {
        let iterator = this.SECONDS_ON_TURN;
        let timer = document.querySelector(".timer-date");
        timer.textContent = this.ONE_MINUTE;

        return setInterval(() => {
            let timeSting = "";
            if (iterator < this.TEN_SECONDS)
                timeSting = this.LESS_THEN_TEN_SECONDS + iterator;
            else
                timeSting = this.MORE_THEN_TEN_SECONDS + iterator;

            timer.textContent = timeSting;
            iterator--
        }, this.ONE_SECOND_MS)
    },

    setSkipTurnTimeout() {
        return setTimeout(() => {
            let activeUnit = document.querySelector(".active-unit");
            activeUnit.classList.remove("active-unit");

            clearInterval(timerInterval);
            if (yourTurn === true) {
                setTimeout(() => {
                    _helper.timeOutEndTurn(type)
                }, _helper.SOCKET_LOADING_TIME_MS)
            }
        }, this.ONE_MINUTE_AND_ONE_SECOND_MS);
    }
}
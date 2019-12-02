const canvasUnits = document.getElementById("units");
const ctx = canvasUnits.getContext('2d');

const width = canvasUnits.width;
const height = canvasUnits.height;

if (window.devicePixelRatio) {
    canvasUnits.style.width = width + 'px';
    canvasUnits.style.height = height + 'px';

    canvasUnits.width = width * window.devicePixelRatio;
    canvasUnits.height = height * window.devicePixelRatio;

    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
}

ctx.fillStyle = "transparent";
ctx.fillRect(0, 0, width, height);
ctx.translate(width / 2, height / 2);


const ARMY_TYPE_INFERNO = "inferno",
    ARMY_TYPE_NECROPOLIS = "necropolis",
    ARMY_TYPE_DANGEON = "dangeon",
    ARMY_TYPE_HAVEN = "haven";

const FIRST_PLAYER = "first",
    SECOND_PLAYER = "second";

function setUnitsOnInitialPositions(yourArmyType, enemyArmyType, playerType) {
    let enemyType
    if (playerType === FIRST_PLAYER) enemyType = SECOND_PLAYER
    const yourArmyData = findOutArmyByArmyType(yourArmyType, playerType),
        enemyArmyData = findOutArmyByArmyType(enemyArmyType, enemyType);

    drawUnits(yourArmyData);
    drawUnits(enemyArmyData);
}

function drawUnits(armyData) {
    const { armyPics, picSizes, unitPositions } = armyData

    for (let i = 0, p = Promise.resolve(); i < armyPics.length; i++) {
        p = p.then(_ => new Promise(resolve => {
            let img = new Image();
            img.src = armyPics[i].src;

            img.onload = function () {
                ctx.drawImage(
                    img,
                    unitPositions[i].x, unitPositions[i].y,
                    picSizes[i].size.width, picSizes[i].size.height
                )

                resolve()
            }

        }));
    }
}

function findOutArmyByArmyType(armyType, playerType) {
    let reversed = false,
        unitPositions = [..._unitHelper.FIRST_PLAYER_UNIT_POSTION],
        armyPics, picSizes;

    if (playerType === SECOND_PLAYER) {
        reversed = true
        unitPositions = [..._unitHelper.SECOND_PLAYER_UNIT_POSTION]
    }

    switch (armyType) {
        case ARMY_TYPE_INFERNO:
            if (reversed) armyPics = [..._unitHelper.INFERNO_REVERSED_PICS]
            else armyPics = [..._unitHelper.INFERNO_PICS]
            picSizes = [..._unitHelper.INFERNO_UNITS_SIZE]
            break;

        case ARMY_TYPE_NECROPOLIS:
            if (reversed) armyPics = [..._unitHelper.NECROPOLIS_REVERSED_PICS]
            else armyPics = [..._unitHelper.NECROPOLIS_PICS]
            picSizes = [..._unitHelper.NECROPOLIS_UNITS_SIZE]
            break;

        case ARMY_TYPE_DANGEON:
            if (reversed) armyPics = [..._unitHelper.DANGEON_REVERSED_PICS]
            else armyPics = [..._unitHelper.DANGEON_PICS]
            picSizes = [..._unitHelper.DANGEON_UNITS_SIZE]
            break;

        case ARMY_TYPE_HAVEN:
            if (reversed) armyPics = [..._unitHelper.HAVEN_REVERSED_PICS]
            else armyPics = [..._unitHelper.HAVEN_PICS]
            picSizes = [..._unitHelper.HAVEN_UNITS_SIZE]
            break;

        default:
            armyPics = [..._unitHelper.HAVEN_PICS]
            picSizes = [..._unitHelper.HAVEN_UNITS_SIZE]
            break;
    }

    return { armyPics: armyPics, picSizes: picSizes, unitPositions: unitPositions }
}

function animateUnitWalk(animationData, stableMovePath, dynamicMovePath) {
    let enemyType = FIRST_PLAYER
    if (animationData.playerType === FIRST_PLAYER) enemyType = SECOND_PLAYER;

    const yourArmyData = findOutArmyByArmyType(animationData.yourArmy, animationData.playerType),
        enemyArmyData = findOutArmyByArmyType(animationData.enemyArmy, enemyType);

    let isEnemyUnit = true;
    if (animationData.playerTypeUnit === animationData.playerType) isEnemyUnit = false;

    let requestFrameId;
    if (stableMovePath.length !== 0) {
        requestFrameId = requestAnimationFrame(() => {
            animateUnitWalk(animationData, stableMovePath, dynamicMovePath)
        })

        ctx.clearRect(-canvasUnits.width / 2, -canvasUnits.height / 2, canvasUnits.width, canvasUnits.height);

        let drawUnits = { ...enemyArmyData };
        if (isEnemyUnit) drawUnits = { ...yourArmyData }

        let specDrawData = { ...yourArmyData };
        if (isEnemyUnit) specDrawData = { ...enemyArmyData }

        for (let i = 0; i < drawUnits.armyPics.length; i++) {
            let img = new Image();
            img.src = drawUnits.armyPics[i].src;

            ctx.drawImage(
                img,
                drawUnits.unitPositions[i].x, drawUnits.unitPositions[i].y,
                drawUnits.picSizes[i].size.width, drawUnits.picSizes[i].size.height
            )
        }

        for (let i = 0; i < specDrawData.armyPics.length; i++) {
            if (i === Number(animationData.unitId)) continue;

            let img = new Image();
            img.src = specDrawData.armyPics[i].src;

            ctx.drawImage(
                img,
                specDrawData.unitPositions[i].x, specDrawData.unitPositions[i].y,
                specDrawData.picSizes[i].size.width, specDrawData.picSizes[i].size.height
            )
        }

        let img = new Image();
        img.src = specDrawData.armyPics[animationData.unitId].src;

        ctx.drawImage(
            img,
            specDrawData.unitPositions[animationData.unitId].x + dynamicMovePath[0].x,
            specDrawData.unitPositions[animationData.unitId].y + dynamicMovePath[0].y,
            specDrawData.picSizes[animationData.unitId].size.width,
            specDrawData.picSizes[animationData.unitId].size.height
        )

        if (stableMovePath[1] === undefined) {
            cancelAnimationFrame(requestFrameId);
            if (animationData.playerTypeUnit === animationData.playerType)
                _socketHelper.sendTurnEndStatus(animationData.gameID)

            return;
        }

        dynamicMovePath[0].x += ((stableMovePath[1].x - stableMovePath[0].x) / 40);
        dynamicMovePath[0].y += ((stableMovePath[1].y - stableMovePath[0].y) / 40);

        if (Math.abs(dynamicMovePath[0].x) > Math.abs(stableMovePath[0].x - stableMovePath[1].x)) {
            if (animationData.playerTypeUnit === FIRST_PLAYER) {
                _unitHelper.FIRST_PLAYER_UNIT_POSTION[animationData.unitId].x =
                    specDrawData.unitPositions[animationData.unitId].x + dynamicMovePath[0].x

                _unitHelper.FIRST_PLAYER_UNIT_POSTION[animationData.unitId].y =
                    specDrawData.unitPositions[animationData.unitId].y + dynamicMovePath[0].y
            } else {
                _unitHelper.SECOND_PLAYER_UNIT_POSTION[animationData.unitId].x =
                    specDrawData.unitPositions[animationData.unitId].x + dynamicMovePath[0].x

                _unitHelper.SECOND_PLAYER_UNIT_POSTION[animationData.unitId].y =
                    specDrawData.unitPositions[animationData.unitId].y + dynamicMovePath[0].y
            }
            stableMovePath.shift();
            dynamicMovePath.shift();
        }
    }
    else {
        cancelAnimationFrame(requestFrameId)
        if (animationData.playerTypeUnit === animationData.playerType)
            _socketHelper.sendTurnEndStatus(animationData.gameID)
    }
}
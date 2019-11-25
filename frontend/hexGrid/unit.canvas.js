const canvasUnits = document.getElementById("units");
const ctx = canvasUnits.getContext('2d');

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
                    unitPositions[i].position.x, unitPositions[i].position.y,
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
    let enemyType
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

        ctx.clearRect(0, 0, canvasUnits.width, canvasUnits.height);

        let drawUnits = { ...enemyArmyData };
        if (isEnemyUnit) drawUnits = { ...yourArmyData }

        let specDrawData = { ...yourArmyData };
        if (isEnemyUnit) specDrawData = { ...enemyArmyData }

        for (let i = 0; i < drawUnits.armyPics.length; i++) {
            let img = new Image();
            img.src = drawUnits.armyPics[i].src;

            ctx.drawImage(
                img,
                drawUnits.unitPositions[i].position.x, drawUnits.unitPositions[i].position.y,
                drawUnits.picSizes[i].size.width, drawUnits.picSizes[i].size.height
            )
        }

        for (let i = 0; i < specDrawData.armyPics.length; i++) {
            if (i === Number(animationData.unitId)) continue;
            
            let img = new Image();
            img.src = specDrawData.armyPics[i].src;

            ctx.drawImage(
                img,
                specDrawData.unitPositions[i].position.x, specDrawData.unitPositions[i].position.y,
                specDrawData.picSizes[i].size.width, specDrawData.picSizes[i].size.height
            )
        }

        stableMovePath.shift();
    }
    else cancelAnimationFrame(requestFrameId)
}

function animate(unitID, map, stateMap) {
    let id;
    if (map.length !== 0) {
        id = requestAnimationFrame(() => {
            animate(unitID, map, stateMap);
        });

        ctx.clearRect(0, 0, canvasUnits.width, canvasUnits.height);

        let src = unitSecondSrc
        if (unitID <= 5) src = unitFirstSrc
        ctx.drawImage(
            src,
            _unitHelper.INIT_UNITS_IMG[unitID].position.x + stateMap[0].x,
            _unitHelper.INIT_UNITS_IMG[unitID].position.y + stateMap[0].y,
            _unitHelper.INIT_UNITS_IMG[unitID].size.width,
            _unitHelper.INIT_UNITS_IMG[unitID].size.height
        )

        for (let i = 0; i < _unitHelper.INIT_UNITS_IMG.length; i++) {
            if (i === unitID) continue;

            let src = unitSecondSrc
            if (i <= 5) src = unitFirstSrc

            ctx.drawImage(
                src,
                _unitHelper.INIT_UNITS_IMG[i].position.x,
                _unitHelper.INIT_UNITS_IMG[i].position.y,
                _unitHelper.INIT_UNITS_IMG[i].size.width,
                _unitHelper.INIT_UNITS_IMG[i].size.height
            )
        }

        stateMap[0].x += 2;
        stateMap[0].y += 0.5;
        if (stateMap[0].x === map[0].x) {
            map.shift();
            stateMap.shift();
        }
    } else {
        cancelAnimationFrame(id);
    }
}
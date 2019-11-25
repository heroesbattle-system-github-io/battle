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

// setUnitsOnInitialPositions(_unitHelper.INIT_UNITS_IMG, armyType, enemyArmyType);

// let unitFirstSrc = new Image();
// unitFirstSrc.src = _unitHelper.INIT_UNITS_IMG[1].src;

// let unitSecondSrc = new Image();
// unitSecondSrc.src = _unitHelper.INIT_UNITS_IMG[6].src;

// let x = 0, y = 0;

// let map = [
//     { "x": 200, "y": 50 },
//     { "x": 30, "y": 30 },
// ];

// let stateMap = [
//     { "x": 0, "y": 0 },
//     { "x": 0, "y": 0 },
// ];

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

// animate(1, map, stateMap);
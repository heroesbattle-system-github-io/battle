const canvasUnits = document.getElementById("units");
const ctx = canvasUnits.getContext('2d');

const ARMY_TYPE_INFERNO = "inferno",
    ARMY_TYPE_NECROPOLIS = "necropolis",
    ARMY_TYPE_DANGEON = "dangeon",
    ARMY_TYPE_HAVEN = "haven";

function setUnitsOnInitialPositions(yourArmyType, enemyArmyType, playerType) {
    let yourArmy = findOutArmyByArmyType(yourArmyType),
        enemyArmy = findOutArmyByArmyType(enemyArmyType);
    if (playerType === "first") {
        drawUnits(yourArmy, _unitHelper.FIRST_PLAYER_UNIT_POSTION);
        drawUnits(enemyArmy, _unitHelper.SECOND_PLAYER_UNIT_POSTION)
    } else {
        drawUnits(yourArmy, _unitHelper.SECOND_PLAYER_UNIT_POSTION);
        drawUnits(enemyArmy, _unitHelper.FIRST_PLAYER_UNIT_POSTION)
    }
}

function drawUnits(pics, positions) {
    for (let i = 0, p = Promise.resolve(); i < pics.length; i++) {
        p = p.then(_ => new Promise(resolve => {
            let img = new Image();
            img.src = pics[i].src;

            img.onload = function () {
                ctx.drawImage(
                    img,
                    positions[i].position.x, positions[i].position.y,
                    pics[i].size.width, pics[i].size.height
                )

                resolve(true)
            }

        }));
    }
}

function findOutArmyByArmyType(type) {
    switch (type) {
        case ARMY_TYPE_INFERNO:
            return _unitHelper.INFERNO_UNITS_PIC
        case ARMY_TYPE_NECROPOLIS:
            return _unitHelper.NECROPOLIS_UNITS_PIC
        case ARMY_TYPE_DANGEON:
            return _unitHelper.DANGEON_UNITS_PIC
        case ARMY_TYPE_INFERNO:
            return _unitHelper.HAVEN_UNITS_PIC
        default:
            return _unitHelper.HAVEN_UNITS_PIC
    }
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
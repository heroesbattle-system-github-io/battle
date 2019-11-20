const canvasUnits = document.getElementById("units");
const ctx = canvasUnits.getContext('2d');

function setUnitsOnInitialPositions(units) {
    for (let i = 0, p = Promise.resolve(); i < units.length; i++) {
        p = p.then(_ => new Promise(resolve => {
            let img = new Image();
            img.src = units[i].src;

            img.onload = function () {
                ctx.drawImage(
                    img,
                    units[i].position.x, units[i].position.y,
                    units[i].size.width, units[i].size.height
                )

                resolve(true)
            }
        }));
    }
}

setUnitsOnInitialPositions(_unitHelper.INIT_UNITS_IMG, 1);

let unitFirstSrc = new Image();
unitFirstSrc.src = _unitHelper.INIT_UNITS_IMG[1].src;

let unitSecondSrc = new Image();
unitSecondSrc.src = _unitHelper.INIT_UNITS_IMG[6].src;

let x = 0, y = 0;

let map = [
    { "x": 200, "y": 50 },
    { "x": 30, "y": 30 },
];

let stateMap = [
    { "x": 0, "y": 0 },
    { "x": 0, "y": 0 },
];

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
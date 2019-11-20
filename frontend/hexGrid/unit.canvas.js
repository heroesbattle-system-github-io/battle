const canvas = document.getElementById("units");
const ctx = canvas.getContext('2d');

function setUnitsOnInitialPositions(units) {
    for (let i = 0, p = Promise.resolve(); i < units.length; i++) {
        p = p.then(_ => new Promise(resolve => {
            let img = new Image();

            img.onload = function () {
                ctx.drawImage(
                    img,
                    units[i].position.x, units[i].position.y,
                    units[i].size.width, units[i].size.height
                )

                resolve()
            }

            img.src = units[i].src;
        }));
    }
}

setUnitsOnInitialPositions(_unitHelper.INIT_UNITS_IMG);
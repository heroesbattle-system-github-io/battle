function drawActiveUnitHex(playerData, unitData, hexes, point) {
    const layout = new Layout(Layout.pointy, new Point(35, 35), new Point(0, 0));

    const canvas = document.getElementById("hexagon-grid");
    const ctx = canvas.getContext('2d');

    const width = canvas.width;
    const height = canvas.height;

    if (window.devicePixelRatio) {
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';

        canvas.width = width * window.devicePixelRatio;
        canvas.height = height * window.devicePixelRatio;

        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    }

    if (hexes === undefined)
        hexes = shapeRectangle(15, 11, permuteQRS);

    ctx.fillStyle = "transparent";
    ctx.fillRect(0, 0, width, height);
    ctx.translate(width / 2, height / 2);

    if (point === undefined)
        point = _helper.NON_EXISTING_POINT

    let activeHex
    if (playerData.yourTurn === true)
        activeHex = playerData.yourUnitsPosition[unitData.unitNumber]
    else
        activeHex = playerData.enemyUnitsPostion[unitData.unitNumber]

    hexes.forEach(hex => {
        drawHex(ctx, layout, hex);
        drawHexLabel(ctx, layout, hex);
    });

    const canvasData = {
        ctx: ctx,
        layout: layout
    }
    const hexData = {
        yourUnits: [...playerData.yourUnitsPosition],
        activeHex: activeHex,
        obstackles: [new Hex(0, -2, 2), new Hex(-1, -1, 2), new Hex(-2, 0, 2), new Hex(0, -1, 1), new Hex(-3, 1, 2), new Hex(1, -3, 2)],
        movementRange: unitData.moveRange,
        point: point
    }

    if (playerData.yourTurn === true)
        drawActiveHexes(canvasData, hexData);

    return hexes
}

function drawActiveHexes(canvasData, hexData) {
    let { ctx, layout } = canvasData;
    let { yourUnits, activeHex, obstackles, movementRange, point } = hexData;

    let data = layout.getReachableHex(activeHex, movementRange, obstackles, yourUnits);
    let reachable = [...data.fringes];
    let results = [];

    for (let i = 0; i < reachable.length; i++) {
        results.push(...reachable[i])
    }
    reachable = [...results];
    results.push(...obstackles);
    results.push(...yourUnits);

    results.forEach(hex => {
        const corners = layout.polygonCorners(hex);

        ctx.beginPath();
        ctx.strokeStyle = "rgba(255, 255, 0, 0.4)"
        ctx.lineWidth = 1;
        ctx.fillStyle = "rgba(0, 0, 0, 0.6)";

        ctx.moveTo(corners[5].x, corners[5].y);
        for (let i = 0; i < 6; i++) {
            ctx.lineTo(corners[i].x, corners[i].y);
        }

        if (layout.insideHex(point, corners))
            ctx.fillStyle = "rgba(0, 0, 0, 0.9)";

        yourUnits.forEach(friendUnit => {
            if (hex.q === friendUnit.q &&
                hex.r === friendUnit.r &&
                hex.s === friendUnit.s
            ) ctx.fillStyle = "transparent";
        });

        obstackles.forEach(obstacle => {
            if (hex.q === obstacle.q &&
                hex.r === obstacle.r &&
                hex.s === obstacle.s
            ) ctx.fillStyle = "red";
        });

        obstackles.forEach(obstacle => {
            if (hex.q === obstacle.q &&
                hex.r === obstacle.r &&
                hex.s === obstacle.s
            ) ctx.fillStyle = "red";
        });

        if (hex.q === activeHex.q &&
            hex.r === activeHex.r &&
            hex.s === activeHex.s
        ) ctx.fillStyle = "green";

        ctx.stroke();
        ctx.fill();
    });
}

function drawHex(ctx, layout, hex) {
    const corners = layout.polygonCorners(hex);

    ctx.beginPath();
    ctx.strokeStyle = "rgb(255, 255, 0, 0.4)"
    ctx.lineWidth = 1;
    ctx.moveTo(corners[5].x, corners[5].y);

    for (let i = 0; i < 6; i++) {
        ctx.lineTo(corners[i].x, corners[i].y);
    }

    ctx.stroke();
}

function colorForHex(hex) {
    if (hex.q === 0 && hex.r === 0 && hex.s === 0)
        return "hsl(0, 50%, 0%)";
    else if (hex.q === 0)
        return "hsl(90, 70%, 35%)";
    else if (hex.r === 0)
        return "hsl(200, 100%, 35%)";
    else if (hex.s === 0)
        return "hsl(300, 40%, 50%)";
    else
        return "hsl(0, 0%, 50%)";
}

function drawHexLabel(ctx, layout, hex) {
    const pointSize = Math.round(
        0.5 * Math.min(Math.abs(layout.size.x),
            Math.abs(layout.size.y))
    );

    const center = layout.hexToPixel(hex);
    ctx.fillStyle = colorForHex(hex);
    ctx.font = `${pointSize}px sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillText(
        hex.length() === 0
            ? "q,r,s"
            : (hex.q + "," + hex.r + "," + hex.s), center.x, center.y
    );
}

function permuteQRS(q, r, s) { return new Hex(q, r, s) }

function shapeRectangle(w, h, constructor) {
    let hexes = [];
    let i1 = -Math.floor(w / 2), i2 = i1 + w;
    let j1 = -Math.floor(h / 2), j2 = j1 + h;

    for (let j = j1; j < j2; j++) {
        let jOffset = -Math.floor(j / 2);

        for (let i = i1 + jOffset; i < i2 + jOffset; i++) {
            hexes.push(constructor(i, j, -i - j));
        }
    }

    return hexes;
}

function setOnHoverEvent(playerData, unitData, hexes) {
    const canvas = document.querySelector("canvas");
    const ctx = canvas.getContext('2d');

    canvas.addEventListener("mousemove", e => {
        let rect = e.target.getBoundingClientRect(),
            x = e.clientX - rect.left - canvas.width / 2,
            y = e.clientY - rect.top - canvas.height / 2,
            i = 0, r;

        ctx.clearRect(-canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);

        drawActiveUnitHex(playerData, unitData, hexes, new Point(x, y));
    })
}

function setOnClickEvent(playerData, unitData, hexes) {
    if (playerData.yourTurn === false) return;

    const canvas = document.getElementById("hexagon-grid");;
    const ctx = canvas.getContext('2d');
    const layout = new Layout(Layout.pointy, new Point(35, 35), new Point(0, 0));
    const yourUnits = [...playerData.yourUnitsPosition];
    const activeHex = playerData.yourUnitsPosition[unitData.unitNumber]
    const obstackles = [new Hex(0, -2, 2), new Hex(-1, -1, 2), new Hex(-2, 0, 2), new Hex(0, -1, 1), new Hex(-3, 1, 2), new Hex(1, -3, 2)]
    const movementRange = unitData.moveRange;

    canvas.addEventListener("click", e => {
        let rect = e.target.getBoundingClientRect(),
            x = e.clientX - rect.left - canvas.width / 2,
            y = e.clientY - rect.top - canvas.height / 2,
            i = 0, r;

        let data = layout.getReachableHex(activeHex, movementRange, obstackles, yourUnits);
        let reachable = [...data.fringes];
        let map = data.came_from;

        let point = new Point(x, y);
        let results = [];

        for (let i = 0; i < reachable.length; i++) {
            results.push(...reachable[i])
        }

        let path = [];
        results.forEach(hex => {
            const corners = layout.polygonCorners(hex);

            if (layout.insideHex(point, corners)) {
                path.push(hex);

                let temp = hex.toString();

                for (let i = 0; i < movementRange; i++) {
                    temp = map[temp]
                    path.push(temp);
                }
            }
        })

        const animationPath = []
        for (let i = path.length - 1; i >= 0; i--) {
            if (path[i] === undefined || path[i] === null) continue;
            animationPath.push(layout.hexToPixel(path[i]))
        }

        console.log(animationPath);
        console.log(path)
        socket.send(`{
            "message":"unit move",
            "gameRoomID": ${playerData.gameID},
            "unitId":"${unitData.unitNumber}",
            "playerType":"${playerData.playerType}",
            "movePath": ${JSON.stringify(animationPath)}
        }`);
    })
}
function drawGrid(id, backgroundColor, withLabels, layout, hexes, point) {
    const canvas = document.getElementById(id);
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

    if (hexes === undefined) {
        hexes = shapeRectangle(15, 11, permuteQRS);
    }

    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, height);
    ctx.translate(width / 2, height / 2);

    if (point === undefined) point = new Point(99999, 9999);

    let activeHex = new Hex(0, 0, 0);

    let obstackles = [
        new Hex(0, -2, 2),
        new Hex(-1, -1, 2),
        new Hex(-2, 0, 2),
        new Hex(0, -1, 1),
        new Hex(-3, 1, 2),
        new Hex(1, -3, 2),
        new Hex(-4, -5, 9)
    ]

    const movementRange = 6;

    hexes.forEach(hex => {
        drawHex(ctx, layout, hex, point);
        if (withLabels) drawHexLabel(ctx, layout, hex);
    });

    drawActiveHexes(ctx, layout, activeHex, obstackles, movementRange, point);
}

function drawActiveHexes(ctx, layout, activeHex, obstackles, movementRange, point) {
    let reachable = layout.getReachableHex(activeHex, movementRange, obstackles);
    let results = [];

    for (let i = 0; i < reachable.length; i++) {
        results.push(...reachable[i])
    }
    reachable = [...results];
    results.push(...obstackles)

    results.forEach(hex => {
        const corners = layout.polygonCorners(hex);

        ctx.beginPath();
        ctx.strokeStyle = "black";
        ctx.fillStyle = "rgba(0,0,0,0.4)";
        ctx.lineWidth = 1;

        ctx.moveTo(corners[5].x, corners[5].y);

        for (let i = 0; i < 6; i++) {
            ctx.lineTo(corners[i].x, corners[i].y);
        }

        if (layout.insideHex(point, corners)) {
            ctx.fillStyle = "black";
        }

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
    ctx.strokeStyle = "black"
    ctx.lineWidth = 1;
    ctx.moveTo(corners[5].x, corners[5].y);

    for (let i = 0; i < 6; i++) {
        ctx.lineTo(corners[i].x, corners[i].y);
    }

    ctx.stroke();
}

function colorForHex(hex) {
    if (hex.q === 0 && hex.r === 0 && hex.s === 0) {
        return "hsl(0, 50%, 0%)";
    } else if (hex.q === 0) {
        return "hsl(90, 70%, 35%)";
    } else if (hex.r === 0) {
        return "hsl(200, 100%, 35%)";
    } else if (hex.s === 0) {
        return "hsl(300, 40%, 50%)";
    } else {
        return "hsl(0, 0%, 50%)";
    }
}

function drawHexLabel(ctx, layout, hex) {
    const pointSize = Math.round(0.5 * Math.min(Math.abs(layout.size.x), Math.abs(layout.size.y)));
    var center = layout.hexToPixel(hex);
    ctx.fillStyle = colorForHex(hex);
    ctx.font = `${pointSize}px sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(hex.length() === 0 ? "q,r,s" : (hex.q + "," + hex.r + "," + hex.s), center.x, center.y);
}

function permuteQRS(q, r, s) { return new Hex(q, r, s); }
function permuteSRQ(s, r, q) { return new Hex(q, r, s); }
function permuteSQR(s, q, r) { return new Hex(q, r, s); }
function permuteRQS(r, q, s) { return new Hex(q, r, s); }
function permuteRSQ(r, s, q) { return new Hex(q, r, s); }
function permuteQSR(q, s, r) { return new Hex(q, r, s); }

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

drawGrid("layout-test-size-2", "transparent", true,
    new Layout(Layout.pointy, new Point(35, 35), new Point(0, 0)));


setOnHoverEvent();
function setOnHoverEvent(reachable) {
    const canvas = document.querySelector("canvas");
    const ctx = canvas.getContext('2d');

    canvas.addEventListener("mousemove", e => {
        let rect = e.target.getBoundingClientRect(),
            x = e.clientX - rect.left - canvas.width / 2,
            y = e.clientY - rect.top - canvas.height / 2,
            i = 0, r;

        ctx.clearRect(-canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);

        drawGrid(
            "layout-test-size-2",
            "transparent",
            true,
            new Layout(Layout.pointy, new Point(35, 35), new Point(0, 0)),
            undefined,
            new Point(x, y)
        );
    })
}
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

    hexes.forEach(hex => {
        drawHex(ctx, layout, hex, point);
        if (withLabels) drawHexLabel(ctx, layout, hex);
    });
}

function inside(point, vs) {
    var x = point.x, y = point.y;

    var inside = false;
    for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
        var xi = vs[i].x, yi = vs[i].y;
        var xj = vs[j].x, yj = vs[j].y;

        var intersect = ((yi > y) != (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }

    return inside;
};

function drawHex(ctx, layout, hex, point) {
    const corners = layout.polygonCorners(hex);
    
    ctx.beginPath();
    ctx.strokeStyle = "black"
    ctx.lineWidth = 1;
    ctx.moveTo(corners[5].x, corners[5].y);

    for (let i = 0; i < 6; i++) {
        ctx.lineTo(corners[i].x, corners[i].y);
    }
    if (inside(point, corners)) {
        ctx.fillStyle = "green";
        ctx.fill();
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


const canvas = document.querySelector("canvas");
const ctx = canvas.getContext('2d');

canvas.onmousemove = function (e) {

    let rect = this.getBoundingClientRect(),
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
};
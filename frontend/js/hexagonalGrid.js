function Point(x, y) {
    return { x: x, y: y };
}

function Hex(q, r, s) {
    if (Math.round(q + r + s) !== 0) throw "q + r + s must be 0";
    return { q: q, r: r, s: s };
}
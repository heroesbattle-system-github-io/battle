const fs = require('fs');

const { Unit } = require("./unit.class");

let infernoUnits = [],
    necropolisUnits = [],
    dungeonUnits = [],
    havenUnits = [];

let unitData = JSON.parse(fs.readFileSync(__dirname + '/unitData.json', 'utf8'));
let unitAmounts = JSON.parse(fs.readFileSync(__dirname + '/unitAmounts.json', 'utf8'));

infernoUnits = setUnits(unitData["Inferno"], unitAmounts["Inferno"]);
necropolisUnits = setUnits(unitData["Necropolis"], unitAmounts["Necropolis"]);
dungeonUnits = setUnits(unitData["Dungeon"], unitAmounts["Dungeon"]);
havenUnits = setUnits(unitData["Haven"], unitAmounts["Haven"]);

function setUnits(unitsFromJson, unitAmounts) {
    let temp = [];

    for (const key in unitsFromJson) {
        let unit = unitsFromJson[key],
            unitAmount = unitAmounts[key];

        temp.push(
            new Unit(
                unit.name,
                unit.attack, unit.defence,
                unit.damage.min, unit.damage.max,
                unit.initiative, unit.speed,
                unit.health, unit.shots,
                unitAmount.amount
            )
        )
    }

    return temp;
}

module.exports = {
    infernoUnits: infernoUnits,
    necropolisUnits: necropolisUnits,
    dungeonUnits: dungeonUnits,
    havenUnits: havenUnits
}
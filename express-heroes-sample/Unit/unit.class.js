class Unit {
    constructor(name, attack, defence, minDamage, maxDamage, health, initiative, was) {
        this.name = name;
        this.attack = attack;
        this.defence = defence;
        this.minDamage = minDamage;
        this.maxDamage = maxDamage;
        this.health = health;
        this.initiative = initiative;
        this.was = was
    }
}

defaultUnitMapFirstPlayer = {
    "unit-first-1": new Unit("Imp", 1, 1, 1, 2, 5, 12, false),
    "unit-first-2": new Unit("Horned Demon", 3, 2, 2, 5, 12, 11, false),
    "unit-first-3": new Unit("Hell Hound", 4, 1, 4, 7, 10, 10, false),
    "unit-first-4": new Unit("Cerberus", 7, 7, 7, 9, 34, 10, false),
    "unit-first-5": new Unit("Succubus", 12, 12, 10, 20, 57, 12, false),
}

defaultUnitMapSecondPlayer = {
    "unit-second-1": new Unit("Pixie", 2, 1, 1, 2, 4, 13, false),
    "unit-second-2": new Unit("Blade Dancer", 1, 3, 1, 2, 13, 7, false),
    "unit-second-3": new Unit("Hunter", 4, 3, 3, 5, 15, 13, false),
    "unit-second-4": new Unit("Druid", 6, 6, 6, 13, 20, 10, false),
    "unit-second-5": new Unit("Unicorn", 13, 13, 8, 16, 50, 16, false)
}

module.exports = {
    defaultUnitMapFirstPlayer: defaultUnitMapFirstPlayer,
    defaultUnitMapSecondPlayer: defaultUnitMapSecondPlayer
} 
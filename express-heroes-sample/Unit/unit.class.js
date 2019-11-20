class Unit {
    constructor(
        name,
        attack,
        defence,
        minDamage,
        maxDamage,
        initiative,
        speed,
        health,
        shots,
        amount,
        walked = false,
        isDied = false,
    ) {
        this.name = name;

        this.attack = attack;
        this.defence = defence;
        this.minDamage = minDamage;
        this.maxDamage = maxDamage;

        this.initiative = initiative;
        this.speed = speed;
        this.health = health;
        this.shots = shots;

        this.amount = amount
        this.walked = walked;
        this.isDied = isDied
    }
}

module.exports = {
    Unit: Unit
} 
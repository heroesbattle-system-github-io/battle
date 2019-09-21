package app.mechanics;

import java.util.ArrayList;

public class Unit {
    private int type; // 1-close 2-archer 3-mage
    private String name;
    private String description;
    private int hp;
    private float squadHP;
    private int attack;
    private int defence;
    private int damage;
    private int initiative;
    private int count;
    private boolean isDead;

    public Unit(int id) {
        /*Работа для Егора*/
        squadHP = hp * count;
    }

    void countAttack(Unit target) {
        if (attack > target.defence) {
            double damage = count * (1 + (attack - target.defence) * 0.05);
            int countToKill = (int) damage / target.hp;
            target.squadHP-=damage;
            if (target.squadHP <= 0) {
                target.isDead = true;
                target.count = 0;
            } else {
                target.count -= countToKill;
            }
        } else {
            double damage = count * (1 / (target.defence - attack) * 0.05);
            int countToKill = (int) damage / target.hp;
            if (target.count <= countToKill) {
                target.isDead = true;
                target.count = 0;
            } else {
                target.count -= countToKill;
            }
        }
    }

    void attackPhysical(Unit target) {
        countAttack(target);
    }

    void attackMagic(Team target, boolean heal) {
        ArrayList<Unit> targets = target.getAll();
        if (!heal) {
            for (Unit u : targets)
                countAttack(u);
        } /*else {
            for (Unit u : targets) {
                                        КАК ХИЛИТЬ?
            }
        }*/
    }

    /*public int getHp() {
        return hp;
    }

    public int getAttack() {
        return attack;
    }

    public int getDefence() {
        return defence;
    }

    public int getDamage() {
        return damage;
    }

    public int getCount() {
        return count;
    }*/

    public int getType() {
        return type;
    }

    public boolean isDead() {
        return isDead;
    }

    public String getInfo() {
        return
                "Name: " + name +
                        "\nHP: " + hp +
                        "\nAttack: " + attack +
                        "\nDefence: " + defence +
                        "\nDamage: " + damage +
                        "\nInitiative: " + initiative +
                        "\nCount: " + count +
                        "\nDead: " + isDead +
                        "\nDescription: \n" + description;
    }

    public void takeDamage() {
    }
}

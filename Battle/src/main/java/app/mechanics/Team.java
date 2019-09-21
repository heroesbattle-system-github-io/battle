package app.mechanics;

import java.util.ArrayList;
import java.util.Map;

public class Team {
    private Unit[] line1;
    private Unit[] line2;
    private Unit[] line3;
    private boolean[] emptyLines;   //true if line is empty or all units dead
    private boolean empty;          // true if all units are dead

    private Map<Integer,Unit> initiativeMap;

    public Team(int id) {
        /*     Заполнение тимы из БД для Егора         */
        emptyLines = new boolean[3];
        for (int i = 0; i < 2; i++) {
            emptyLines[i] = false;
        }
        empty = false;
    }

    public boolean checkTeam() {
        boolean dead = true;
        for (Unit u : line1)
            if (!u.isDead()) {
                dead = false;
                break;
            }
        emptyLines[0] = dead;
        dead = true;
        for (Unit u : line2)
            if (!u.isDead()) {
                dead = false;
                break;
            }
        emptyLines[1] = dead;
        dead = true;
        for (Unit u : line3)
            if (!u.isDead()) {
                dead = false;
                break;
            }
        emptyLines[2] = dead;
        dead = true;
        for (boolean b : emptyLines) {
            if (!b) {
                dead = false;
                break;
            }
        }
        empty = dead;
        return empty;
    }

    public Unit get(int line, int cell) {
        switch (line) {
            case 1:
                return line1[cell];
            case 2:
                return line2[cell];
            default:
                return line3[cell];
        }
    }

    public Unit get(String line, String cell) {
        int l = Integer.getInteger(line);
        int c = Integer.getInteger(cell);
        switch (l) {
            case 1:
                return line1[c];
            case 2:
                return line2[c];
            default:
                return line3[c];
        }
    }

    public ArrayList<Unit> getAll() {
        ArrayList<Unit> units = new ArrayList<>();
        for (Unit u : line1)
            if (!u.isDead())
                units.add(u);
        for (Unit u : line2)
            if (!u.isDead())
                units.add(u);
        for (Unit u : line3)
            if (!u.isDead())
                units.add(u);
        return units;
    }

    public boolean checkLine(int line) {
        return emptyLines[line];
    }
}

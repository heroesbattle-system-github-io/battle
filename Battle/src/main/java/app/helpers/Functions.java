package app.helpers;

import app.mechanics.Unit;

public class Functions {
    public static void doSort(Unit[] units, int start, int end) {
        if (start >= end)
            return;
        int i = start, j = end;
        int cur = i - (i - j) / 2;
        while (i < j) {
            while (i < cur && (units[i].getInitiative() <= units[cur].getInitiative())) {
                i++;
            }
            while (j > cur && (units[cur].getInitiative() <= units[j].getInitiative())) {
                j--;
            }
            if (i < j) {
                Unit temp = units[i];
                units[i] = units[j];
                units[j] = temp;
                if (i == cur)
                    cur = j;
                else if (j == cur)
                    cur = i;
            }
        }
        doSort(units, start, cur);
        doSort(units, cur + 1, end);
        return;
    }
}

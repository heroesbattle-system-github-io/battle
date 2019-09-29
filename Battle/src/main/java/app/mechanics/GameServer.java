package app.mechanics;

import app.helpers.Functions;
import app.server.MainServer;
import io.javalin.Javalin;
import io.javalin.websocket.WsContext;

import java.util.ArrayList;
import java.util.Arrays;

public class GameServer {

    private MainServer mainServer;
    private int id;
    private Javalin server;
    private WsContext P1 = null;
    private WsContext P2 = null;
    private Team team1;
    private Team team2;
    private boolean firstTurn;
    private ArrayList<Unit> turnQuery;
    private Unit chosen;
    private boolean free;

    public GameServer(int gameId, MainServer mainServer) {
        this.mainServer = mainServer;
        this.id = gameId;
        server = Javalin.create(javalinConfig -> {
            javalinConfig.addStaticFiles("/game");
        }).start(8080 + gameId);
        server.ws("/game" + gameId, ws -> {
            ws.onConnect(ctx -> {
                if (P1 == null)
                    P1 = ctx;
                if (P2 == null) {
                    P2 = ctx;
                } else
                    // disconnect odd user from game
                    sendMsg(ctx, "/disconnect");
                if (P1 != null && P2 != null) {
                    free = false;
                }
            });
            ws.onClose(ctx -> {
                if (P1 == ctx && P2 != null) {
                    sendMsg(P2, "/win");
                } else if (P2 == ctx && P1 != null) {
                    sendMsg(P1, "/win");
                }
                mainServer.closeGameServer(id);
            });
            ws.onMessage(ctx -> {
                processCommand(ctx, ctx.message());
            });
        });
        free = true;
        turnQuery = new ArrayList<>();
        team1 = null;
        team2 = null;
    }

    public void sendMsg(WsContext toUser, String msg) {
        toUser.send(msg);
    }

    private void setQuery() {
        turnQuery.addAll(team1.getAllUnits());
        turnQuery.addAll(team2.getAllUnits());
        Unit[] srt = turnQuery.toArray(new Unit[0]);
        Functions.doSort(srt, 0, srt.length - 1);
        turnQuery.clear();
        turnQuery.addAll(Arrays.asList(srt));
        chosen = turnQuery.get(0);
        if (turnQuery.get(0).getTeam() == 1) firstTurn = true;
        else firstTurn = false;
    }

    private void nextTurn() {
        if (team1.checkTeam()) {
            // win P2
            // lose P1
        }
        if (team2.checkTeam()) {
            // win P1
            // lose P2
        }
        int now = turnQuery.indexOf(chosen);
        chosen = turnQuery.get(++now);
        if (chosen.getTeam() == 1) {
            firstTurn = true;
            // start turn of Player1
            // send game status
        } else {
            firstTurn = false;
            // start turn of Player2
            // send game status
        }
    }

    private void processCommand(WsContext ctx, String command) {
        String[] commandParts = command.split("\\s");
        Unit target;
        switch (commandParts[0]) {
            case "/chooseteam":
                // выбор команды из списка доступных
                // /chooseteam *team ID*
                if (ctx == P1 && team1 == null) {
                    //выбор команды первого игрока
                }
                if (ctx == P2 && team2 == null) {
                    //выбор команды второго игрока
                }
                if (team1 != null && team2 != null) {
                    setQuery();
                    if (firstTurn) {
                        // start turn of Player1
                        // send game status
                    } else {
                        // start turn of Player1
                        // send game status
                    }
                }
                break;
            case "/examineunit":
                // /examineunit *team* *line* *cell*
                String info;
                if (commandParts[1].equals("1")) {
                    info = team1.get(commandParts[2], commandParts[3]).getInfo();
                } else {
                    info = team2.get(commandParts[2], commandParts[3]).getInfo();
                }
                //ctx.send()
                //send to player stats of chosen unit
                break;
            case "/attack":
                /*  /attack *target line* *target cell*
                 *  or for mages:
                 *  /attack *target team*
                 */

                if (ctx == P1 && firstTurn) {
                    attackCheck(commandParts, team2, team1);
                }
                if (ctx == P2 && !firstTurn) {
                    attackCheck(commandParts, team1, team2);
                }
                nextTurn();
                break;
            case "/skipturn":
                // /skipturn
                nextTurn();
            default:
                break;
        }
    }

    private void attackCheck(String[] commandParts, Team team2, Team team1) {
        Unit target;
        switch (chosen.getType()) {
            case 1:
                target = team2.get(Integer.getInteger(commandParts[1]), Integer.getInteger(commandParts[2]));
                if (target != null && !target.isDead())
                    switch (commandParts[3]) {
                        case "1":
                            chosen.attackPhysical(target);
                            team2.checkTeam();
                            break;
                        case "2":
                            if (team2.checkLine(1)) {
                                chosen.attackPhysical(target);
                                team2.checkTeam();
                            }
                            break;
                        case "3":
                            if (team2.checkLine(1) && team2.checkLine(2)) {
                                chosen.attackPhysical(target);
                                team2.checkTeam();
                            }
                            break;
                    }
                break;
            case 2:
                target = team2.get(Integer.getInteger(commandParts[1]), Integer.getInteger(commandParts[2]));
                if (target != null && !target.isDead()) {
                    chosen.attackPhysical(target);
                    team2.checkTeam();
                }
                break;
            case 3:
                if (commandParts[1].equals("1")) {
                    chosen.attackMagic(team1, true);
                    //heal team1
                } else {
                    chosen.attackMagic(team2, false);
                    // damage team2
                }
                break;
        }
    }

    public boolean isFree() {
        return free;
    }
}

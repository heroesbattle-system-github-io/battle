package app.mechanics;

import io.javalin.Javalin;
import io.javalin.websocket.WsContext;

public class GameServer {
    private Javalin server;
    private WsContext P1 = null;
    private WsContext P2 = null;
    private Team team1;
    private Team team2;
    private int turn;
    private Unit chosen;
    private boolean free;

    public GameServer(int gameId) {
        server = Javalin.create(javalinConfig -> {
            javalinConfig.addStaticFiles("/game");
        }).start(8080 + gameId);
        free = true;
        server.ws("/game" + gameId, ws -> {
            ws.onConnect(ctx -> {
                if (P1 == null)
                    P1 = ctx;
                else if (P2 == null) {
                    P2 = ctx;
                    free = false;
                } else
                    // disconnect odd user from game
                    sendMsg(ctx, "/disconnect");
            });
            ws.onClose(ctx -> {
                if (P1 == ctx && P2 != null) {
                    sendMsg(P2, "/win");
                } else if (P2 == ctx && P1 != null) {
                    sendMsg(P1, "/win");
                }

            });
            ws.onMessage(ctx -> {
                processCommand(ctx, ctx.message());
            });
        });
    }

    public void sendMsg(WsContext toUser, String msg) {
        toUser.send(msg);
    }

    private void processCommand(WsContext ctx, String command) {
        String[] commandParts = command.split("\\s");
        Unit target;
        switch (commandParts[0]) {
            case "/chooseteam":
                // выбор команды из списка доступных
                // /chooseteam *team ID*
                if (ctx == P1) {

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

                if (ctx == P1) {
                    attackCheck(commandParts, team2, team1);
                } else {
                    attackCheck(commandParts, team1, team2);
                }
                break;
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

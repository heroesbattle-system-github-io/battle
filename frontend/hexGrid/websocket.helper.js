const _socketHelper = {
    WEBSOCKET_MSG_SEND_ARMY_TYPE: "send army",

    SELECTED_ARMY_CLASS: "active",

    NO_CHOOSED_ALERT_MSG: "No one army is choosed",

    chooseArmyEvent(selectedArmy) {
        let flags = document.querySelectorAll(".flag")

        flags.forEach(flag => {
            flag.addEventListener("click", (ev) => {
                ev.preventDefault();

                const target = ev.currentTarget;

                if (target.classList.contains(selectedArmy)) {
                    target.classList.remove(selectedArmy)
                    return;
                }

                flags.forEach(flag => {
                    if (flag.classList.contains(selectedArmy))
                        flag.classList.remove(selectedArmy)
                });

                target.classList.add(selectedArmy)
            })
        })
    },

    sendArmyToWebsocketServer() {
        let startBtn = document.querySelector(".start-game");

        startBtn.addEventListener("click", (ev) => {
            ev.preventDefault();

            this.btnStyledOnClick(ev);

            let choosedArmy = document.querySelector(".active");

            if (choosedArmy === null) {
                alert(this.NO_CHOOSED_ALERT_MSG);
            }
            else {
                let container = document.querySelector(".wait-overflow__status-bar");

                container.classList.add("disabled")

                let armyType = choosedArmy.dataset.type;

                socket.send(`{
                        "message":"${this.WEBSOCKET_MSG_SEND_ARMY_TYPE}",
                        "armyType":"${armyType}"
                }`)
            }
        })
    },

    btnStyledOnClick(ev) {
        const target = ev.target;
        target.style.outline = "1px solid black"

        setTimeout(() => {
            target.style.outline = "1px solid rgba(255, 255, 126, 0.6)"
        }, 150)
    }
}
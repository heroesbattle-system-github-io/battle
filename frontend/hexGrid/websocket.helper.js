const _socketHelper = {
    WEBSOCKET_MSG_SEND_ARMY_TYPE: "send army",

    chooseArmyAndSendToWebsoket(socket) {
        let flags = document.querySelectorAll(".flag")

        flags.forEach(flag => {
            flag.addEventListener("click", (ev) => {
                ev.preventDefault();

                const target = ev.currentTarget,
                    flagType = target.classList[target.classList.length - 1];

                socket.send(`{
                        "message":"${this.WEBSOCKET_MSG_SEND_ARMY_TYPE}",
                        "armyType":"${flagType}"
                }`)
            })
        })

    }
}
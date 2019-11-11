const _helper = {
    initialUnitsPositionsOnScreen: [
        document.querySelector('g[transform="translate(-450,-952)"]'),
        document.querySelector('g[transform="translate(-600,-693)"]'),
        document.querySelector('g[transform="translate(-750,-433)"]'),
        document.querySelector('g[transform="translate(-900, -173)"]'),
        document.querySelector('g[transform="translate(-1050, 86)"]'),

        document.querySelector('g[transform="translate(1350, 88)"]'),
        document.querySelector('g[transform="translate(1200, 347)"]'),
        document.querySelector('g[transform="translate(1050, 606)"]'),
        document.querySelector('g[transform="translate(900, 865)"]'),
        document.querySelector('g[transform="translate(750, 1125)"]')
    ],

    unitDOMElementNames: [
        document.querySelector(".unit-first-1"),
        document.querySelector(".unit-first-2"),
        document.querySelector(".unit-first-3"),
        document.querySelector(".unit-first-4"),
        document.querySelector(".unit-first-5"),

        document.querySelector(".unit-second-1"),
        document.querySelector(".unit-second-2"),
        document.querySelector(".unit-second-3"),
        document.querySelector(".unit-second-4"),
        document.querySelector(".unit-second-5")
    ],

    unitHealthBarNames: [
        document.querySelector(".health-unit-first-1"),
        document.querySelector(".health-unit-first-2"),
        document.querySelector(".health-unit-first-3"),
        document.querySelector(".health-unit-first-4"),
        document.querySelector(".health-unit-first-5"),

        document.querySelector(".health-unit-second-1"),
        document.querySelector(".health-unit-second-2"),
        document.querySelector(".health-unit-second-3"),
        document.querySelector(".health-unit-second-4"),
        document.querySelector(".health-unit-second-5")
    ],

    setUnitsEventListener(playerType) {
        let images = null;
        if (playerType === "first") {
            images = document.querySelectorAll(".unit-second");
        } else if (playerType === "second") {
            images = document.querySelectorAll(".unit-first");
        }

        images.forEach(image => {
            image.addEventListener("click", (ev) => {
                if (yourTurn === false) return;
                requestForAnimation(ev.target)
            })
        });
    },

    startGame() {
        let overBack = document.querySelector(".overflow-company");
        overBack.classList.add("fadeOut")
    },

    endGame(msg) {
        let winInfo = document.querySelector(".win-status");
        winInfo.textContent = msg;
        let overBack = document.querySelector(".win-overflow-company");
        overBack.classList.add("fadeIn");
    },

    initUnitPositionOnScreen(image, elementPositionedBy, healthBar) {
        let offset = elementPositionedBy.getBoundingClientRect();
        let centerX = offset.top + offset.width / 2;
        let centerY = offset.left + offset.height / 2;

        image.style.left = centerY - 40 + 'px';
        image.style.top = centerX - 80 + 'px';

        healthBar.style.left = centerY - 25 + 'px';
        healthBar.style.top = image.offsetTop + image.offsetHeight - 14 + 'px';
    },

    initUnitsPositionOnScreen() {
        for (let i = 0; i < this.initialUnitsPositionsOnScreen.length; i++) {
            this.initUnitPositionOnScreen(
                this.unitDOMElementNames[i],
                this.initialUnitsPositionsOnScreen[i],
                this.unitHealthBarNames[i]
            )
        }
    }
}
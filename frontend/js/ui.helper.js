let startGameBtn = document.querySelector(".btn");

startGameBtn.addEventListener("click", btnPressed);

function btnPressed(ev) {
    let target = ev.target;
    target.style.outline = "1px solid black"

    setTimeout(() => {
        target.style.outline = "1px solid rgba(255, 255, 126, 0.6)"
    }, 150)
}
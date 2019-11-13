let activeUnitAnimationInterval

function handleFifthUnit() {
    if (ev.target.classList.contains("active-unit")) {
        ev.target.style.backgroundPosition = "0px 110px"
        let position = 0;

        activeUnitAnimationInterval = setInterval(() => {
            position -= 100;
            ev.target.style.backgroundPosition = `${position}px 104px`
            if (position <= -550) position = 0;
        }, 200)
    }
}
// waitState 0.16909
// document.querySelector(".unit-first-5 ").addEventListener("click", (ev) => {
//     ev.target.style.backgroundPosition = "0px 110px"
//     let position = 0;

//     setInterval(() => {
//         position -= 100;
//         ev.target.style.backgroundPosition = `${position}px 104px`
//         if (position <= -550) position = 0;
//     }, 200)
// })

// dieState
// background-size: 660px Auto;
// document.querySelector(".unit-first-5 ").addEventListener("click", (ev) => {
//     ev.target.style.backgroundPosition = "0px 110px"
//     let position = 0;

//     for (let i = 0; i < 5; i++) {
//         setTimeout(() => {
//             position -= 100;
//             ev.target.style.backgroundPosition = `${position}px 110px`
//             if (position <= -550) position = 0;
//         }, 200 * i)
//     }
//     setTimeout(() => {
//         ev.target.classList.add("hide")
//     }, 800)
// })

//attack
// document.querySelector(".unit-first-5 ").addEventListener("click", (ev) => {
//     ev.target.style.backgroundPosition = "0px 95px"
//     let position = 0;

//     for (let i = 0; i < 5; i++) {
//         setTimeout(() => {
//             position -= 100;
//             ev.target.style.backgroundPosition = `${position}px 110px`
//             if (position <= -500) position = 0;
//         }, 200 * i)
//     }
// })
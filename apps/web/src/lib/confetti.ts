import confetti from "canvas-confetti";

export function StartConfetti() {
    confetti({
        particleCount: 500,
        spread: 100,
        origin: { y: 1 },
    })
}
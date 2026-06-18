let leftY = 50;
let rightY = 50;

let scoreLeft = 0;
let scoreRight = 0;

// prędkość zmniejszona o połowę
let paper = { x: 50, y: 50, vx: 0.125, vy: 0.09 };

let gameRunning = false;

let collisionCooldown = 0;

const gameEl = document.getElementById("game");
const leftEl = document.getElementById("leftPlayer");
const rightEl = document.getElementById("rightPlayer");
const paperEl = document.getElementById("paper");

const leftHand = document.querySelector(".left-hand img");
const rightHand = document.querySelector(".right-hand img");

const scoreLeftEl = document.getElementById("scoreLeft");
const scoreRightEl = document.getElementById("scoreRight");

document.getElementById("startBtn").onclick = () => gameRunning = true;
document.getElementById("stopBtn").onclick = () => gameRunning = false;

// ✅ klawiatura (desktop) — krok zmniejszony o połowę
window.addEventListener("keydown", (e) => {
  if (e.key === "w" || e.key === "W") leftY = Math.max(0, leftY - 2.5);
  if (e.key === "s" || e.key === "S") leftY = Math.min(90, leftY + 2.5);

  if (e.key === "ArrowUp") rightY = Math.max(0, rightY - 2.5);
  if (e.key === "ArrowDown") rightY = Math.min(90, rightY + 2.5);
});

// ✅ dotyk (telefon — Android i iOS)
// lewa połowa ekranu = gracz lewy, prawa połowa = gracz prawy
// pozycja paska = tam, gdzie dotknięto (obsługa wielu dotknięć naraz)
function handleTouch(e) {
  e.preventDefault();
  const rect = gameEl.getBoundingClientRect();

  for (const touch of e.touches) {
    const relX = touch.clientX - rect.left;
    const relY = touch.clientY - rect.top;
    const percentY = Math.max(0, Math.min(90, (relY / rect.height) * 100));

    if (relX < rect.width / 2) {
      leftY = percentY;
    } else {
      rightY = percentY;
    }
  }
}

gameEl.addEventListener("touchstart", handleTouch, { passive: false });
gameEl.addEventListener("touchmove", handleTouch, { passive: false });

function hitAnimation(handEl) {
  handEl.classList.add("hit");
  setTimeout(() => handEl.classList.remove("hit"), 120);
}

function resetBall(direction) {
  paper.x = 50;
  paper.y = 50;

  // prędkość zmniejszona o połowę
  paper.vx = 0.125 * direction;
  paper.vy = (Math.random() - 0.5) * 0.2;

  collisionCooldown = 20;
}

function update() {
  if (!gameRunning) return;

  paper.x += paper.vx;
  paper.y += paper.vy;

  if (paper.y <= 0 || paper.y >= 90) {
    paper.vy *= -1;
  }

  // punkty
  if (paper.x <= 0) {
    scoreRight++;
    scoreRightEl.textContent = scoreRight;
    resetBall(1);
  }

  if (paper.x >= 90) {
    scoreLeft++;
    scoreLeftEl.textContent = scoreLeft;
    resetBall(-1);
  }

  render();

  if (collisionCooldown > 0) collisionCooldown--;

  const paperRect = paperEl.getBoundingClientRect();
  const leftRect = leftEl.getBoundingClientRect();
  const rightRect = rightEl.getBoundingClientRect();

  // LEWY
  if (
    collisionCooldown === 0 &&
    paperRect.left <= leftRect.right &&
    paperRect.bottom >= leftRect.top &&
    paperRect.top <= leftRect.bottom
  ) {
    paper.vx = Math.abs(paper.vx);
    paper.x += 0.3;
    collisionCooldown = 10;

    hitAnimation(leftHand);
  }

  // PRAWY
  if (
    collisionCooldown === 0 &&
    paperRect.right >= rightRect.left &&
    paperRect.bottom >= rightRect.top &&
    paperRect.top <= rightRect.bottom
  ) {
    paper.vx = -Math.abs(paper.vx);
    paper.x -= 0.3;
    collisionCooldown = 10;

    hitAnimation(rightHand);
  }
}

function render() {
  leftEl.style.top = leftY + "%";
  rightEl.style.top = rightY + "%";

  paper.x = Math.max(0, Math.min(90, paper.x));
  paper.y = Math.max(0, Math.min(90, paper.y));

  paperEl.style.left = paper.x + "%";
  paperEl.style.top = paper.y + "%";
}

function gameLoop() {
  update();
  requestAnimationFrame(gameLoop);
}

gameLoop();
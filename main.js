let leftY = 50;
let rightY = 50;

let scoreLeft = 0;
let scoreRight = 0;

let paper = { x: 50, y: 50, vx: 0.25, vy: 0.18 };

let gameRunning = false;

// ✅ NOWY cooldown
let collisionCooldown = 0;

const leftEl = document.getElementById("leftPlayer");
const rightEl = document.getElementById("rightPlayer");
const paperEl = document.getElementById("paper");

const leftHand = document.querySelector(".left-hand img");
const rightHand = document.querySelector(".right-hand img");

const scoreLeftEl = document.getElementById("scoreLeft");
const scoreRightEl = document.getElementById("scoreRight");

document.getElementById("startBtn").onclick = () => gameRunning = true;
document.getElementById("stopBtn").onclick = () => gameRunning = false;

window.addEventListener("keydown", (e) => {
  if (e.key === "w") leftY = Math.max(0, leftY - 5);
  if (e.key === "s") leftY = Math.min(90, leftY + 5);

  if (e.key === "ArrowUp") rightY = Math.max(0, rightY - 5);
  if (e.key === "ArrowDown") rightY = Math.min(90, rightY + 5);
});

function hitAnimation(handEl) {
  handEl.classList.add("hit");
  setTimeout(() => handEl.classList.remove("hit"), 120);
}

function resetBall(direction) {
  paper.x = 50;
  paper.y = 50;

  paper.vx = 0.25 * direction;
  paper.vy = (Math.random() - 0.5) * 0.4;

  collisionCooldown = 20; // 🔥 żeby nie odbiło od razu po respawnie
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

  // ✅ zmniejszamy cooldown
  if (collisionCooldown > 0) collisionCooldown--;

  const paperRect = paperEl.getBoundingClientRect();
  const leftRect = leftEl.getBoundingClientRect();
  const rightRect = rightEl.getBoundingClientRect();

  // ✅ LEWY
  if (
    collisionCooldown === 0 &&
    paperRect.left <= leftRect.right &&
    paperRect.bottom >= leftRect.top &&
    paperRect.top <= leftRect.bottom
  ) {
    paper.vx = Math.abs(paper.vx);
    paper.x += 0.3; // ✅ mniejszy "push"
    collisionCooldown = 10;

    hitAnimation(leftHand);
  }

  // ✅ PRAWY
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
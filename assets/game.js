const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const characters = {
  cyborg: {
    image: new Image(),
    src: 'assets/cyborg.png',
    superpower: 'turbo',
    jumpHeight: 20,
    gravity: 0.8
  },
  cat: {
    image: new Image(),
    src: 'assets/cat.png',
    superpower: 'antigravity',
    jumpHeight: 20,
    gravity: 0.6
  },
  dragon: {
    image: new Image(),
    src: 'assets/dragon.png',
    superpower: 'fireShield',
    jumpHeight: 20,
    gravity: 1.0
  }
};

let character = {
  x: 50,
  y: canvas.height - 100,
  width: 50,
  height: 50,
  yVelocity: 0,
  onGround: false,
  image: null
};

let obstacles = [];
let coins = [];
let hearts = [];
let score = 0;
let lives = 3;
let maxLives = 5;
let powerActive = false;
let powerTimer = 0;
let lastHeartTime = Date.now();

function initGame(selectedCharacter) {
  character.image = characters[selectedCharacter].image;
  character.image.src = characters[selectedCharacter].src;
}

function drawCharacter() {
  if (character.image) {
    ctx.drawImage(character.image, character.x, character.y, character.width, character.height);
  }
}

function updateCharacter() {
  character.yVelocity += characters[selectedCharacter].gravity;
  character.y += character.yVelocity;

  if (character.y + character.height > canvas.height - 50) {
    character.y = canvas.height - character.height - 50;
    character.yVelocity = 0;
    character.onGround = true;
  }
}

function createObstacle() {
  let types = [
    { width: 50, height: 50, color: 'red' },
    { width: 30, height: 70, color: 'orange' },
    { width: 70, height: 30, color: 'yellow' }
  ];

  let type = types[Math.floor(Math.random() * types.length)];
  let obstacle = {
    x: canvas.width,
    y: canvas.height - type.height - 50,
    width: type.width,
    height: type.height,
    color: type.color
  };

  obstacles.push(obstacle);
}

function drawObstacles() {
  obstacles.forEach(obstacle => {
    ctx.fillStyle = obstacle.color;
    ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
  });
}

function updateObstacles() {
  obstacles.forEach(obstacle => {
    obstacle.x -= 5;
  });

  obstacles = obstacles.filter(obstacle => obstacle.x + obstacle.width > 0);
}

function drawCoins() {
  coins.forEach(coin => {
    ctx.fillStyle = 'gold';
    ctx.beginPath();
    ctx.arc(coin.x, coin.y, coin.radius, 0, Math.PI * 2);
    ctx.fill();
  });
}

function updateCoins() {
  coins.forEach(coin => {
    coin.x -= 5;
  });

  coins = coins.filter(coin => coin.x + coin.radius > 0);
}

function checkCollision(rect1, rect2) {
  return (
    rect1.x < rect2.x + rect2.width &&
    rect1.x + rect1.width > rect2.x &&
    rect1.y < rect2.y + rect2.height &&
    rect1.y + rect1.height > rect2.y
  );
}

function checkCollisions() {
  obstacles.forEach(obstacle => {
    if (checkCollision(character, obstacle)) {
      lives--;
      if (lives === 0) {
        alert('Game Over');
        window.location.reload();
      }
    }
  });

  coins.forEach(coin => {
    if (checkCollision(character, coin)) {
      score++;
      coins.splice(coins.indexOf(coin), 1);
    }
  });
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawCharacter();
  updateCharacter();

  if (Math.random() < 0.01) {
    createObstacle();
  }

  drawObstacles();
  updateObstacles();

  drawCoins();
  updateCoins();

  checkCollisions();

  requestAnimationFrame(gameLoop);
}

window.addEventListener('keydown', e => {
  if (e.key === ' ') {
    if (character.onGround) {
      character.yVelocity = -characters[selectedCharacter].jumpHeight;
      character.onGround = false;
    }
  }
});

initGame('cyborg');
gameLoop();

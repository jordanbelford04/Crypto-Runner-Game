let selectedCharacter = null;
const characters = {
  cyborg: { name: 'Turbo Cyborg', image: new Image() },
  cat: { name: 'Arcane Knight', image: new Image() },
  dragon: { name: 'Night Dragon', image: new Image() },
  new: { name: 'Robin Good', image: new Image() },
  robin: { name: 'Robin Good', image: new Image() }
};

document.addEventListener('DOMContentLoaded', () => {
  const characterOptions = document.querySelectorAll('.character-option');
  characterOptions.forEach(option => {
    option.addEventListener('click', () => {
      characterOptions.forEach(opt => opt.classList.remove('selected'));
      option.classList.add('selected');
      selectedCharacter = option.getAttribute('data-character');
    });
  });

  document.getElementById('start-button').addEventListener('click', () => {
    if (selectedCharacter) {
      document.getElementById('main-screen').style.display = 'none';
      document.getElementById('gameCanvas').style.display = 'block';
      startGame();
    } else {
      alert('Выберите персонажа перед началом игры.');
    }
  });

  characters.cyborg.image.src = 'assets/cyborg.png';
  characters.cat.image.src = 'assets/cat.png';
  characters.dragon.image.src = 'assets/dragon.png';
  characters.new.image.src = 'assets/hero.png';
  characters.robin.image.src = 'assets/RobinGood.png';
});

function startGame() {
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');
  let player = {
    x: 50,
    y: canvas.height - 150,
    width: 50,
    height: 50,
    velocityY: 0,
    gravity: 1.5
  };
  let obstacles = [];
  let frame = 0;
  let score = 0;

  function drawPlayer() {
    ctx.drawImage(characters[selectedCharacter].image, player.x, player.y, player.width, player.height);
  }

  function drawObstacles() {
    ctx.fillStyle = 'red';
    obstacles.forEach(obstacle => {
      ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    });
  }

  function updateObstacles() {
    if (frame % 120 === 0) {
      obstacles.push({
        x: canvas.width,
        y: canvas.height - 50,
        width: 50,
        height: 50
      });
    }
    obstacles.forEach(obstacle => {
      obstacle.x -= 5;
    });
    obstacles = obstacles.filter(obstacle => obstacle.x + obstacle.width > 0);
  }

  function detectCollision() {
    for (let obstacle of obstacles) {
      if (
        player.x < obstacle.x + obstacle.width &&
        player.x + player.width > obstacle.x &&
        player.y < obstacle.y + obstacle.height &&
        player.y + player.height > obstacle.y
      ) {
        return true;
      }
    }
    return false;
  }

  function updateScore() {
    score += 1;
    document.getElementById('coin-counter').innerText = `У вас всего: ${score} `;
  }

  function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlayer();
    drawObstacles();
    updateObstacles();
    updateScore();

    if (detectCollision()) {
      alert('Игра окончена!');
      document.getElementById('main-screen').style.display = 'block';
      document.getElementById('gameCanvas').style.display = 'none';
      return;
    }

    player.velocityY += player.gravity;
    player.y += player.velocityY;
    if (player.y + player.height > canvas.height) {
      player.y = canvas.height - player.height;
      player.velocityY = 0;
    }

    frame++;
    requestAnimationFrame(gameLoop);
  }

  document.addEventListener('keydown', event => {
    if (event.code === 'Space' && player.y + player.height === canvas.height) {
      player.velocityY = -20;
    }
  });

  gameLoop();
}

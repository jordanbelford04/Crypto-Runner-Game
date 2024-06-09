// Загрузка изображений
const images = {
  cyborg: new Image(),
  cat: new Image(),
  dragon: new Image(),
  robin: new Image(),
  coin: new Image(),
  obstacle: new Image(),
};
images.cyborg.src = 'assets/cyborg.png';
images.cat.src = 'assets/cat.png';
images.dragon.src = 'assets/dragon.png';
images.robin.src = 'assets/RobinGood.png';
images.coin.src = 'assets/coin.png';
images.obstacle.src = 'assets/obstacle.png';

// Переменные игры
let canvas, ctx;
let player, obstacles, coins, score, lives, gameSpeed, isJumping, isSuper;
const gravity = 0.6;
const jumpStrength = 15;
const superPowerDuration = 3000;
let selectedCharacter = 'cyborg';

// Инициализация игры
function initGame(character) {
  canvas = document.getElementById('gameCanvas');
  ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  player = {
    x: 50,
    y: canvas.height - 100,
    width: 50,
    height: 50,
    velocity: 0,
    image: images[character],
    superPower: getSuperPower(character)
  };
  obstacles = [];
  coins = [];
  score = 0;
  lives = 3;
  gameSpeed = 3;
  isJumping = false;
  isSuper = false;
  updateHeartsDisplay(lives);
  requestAnimationFrame(updateGame);
}

// Получение суперсилы персонажа
function getSuperPower(character) {
  switch (character) {
    case 'cyborg':
      return () => {
        // Суперсила: Увеличение скорости
        gameSpeed *= 2;
        setTimeout(() => gameSpeed /= 2, superPowerDuration);
      };
    case 'cat':
      return () => {
        // Суперсила: Невидимость
        isSuper = true;
        setTimeout(() => isSuper = false, superPowerDuration);
      };
    case 'dragon':
      return () => {
        // Суперсила: Полет (постоянный прыжок)
        isJumping = true;
        setTimeout(() => isJumping = false, superPowerDuration);
      };
    case 'robin':
      return () => {
        // Суперсила: Разрушение препятствий
        obstacles = [];
      };
    default:
      return () => {};
  }
}

// Обновление игры
function updateGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Обновление позиции игрока
  if (isJumping) {
    player.velocity = -jumpStrength;
  }
  player.velocity += gravity;
  player.y += player.velocity;
  if (player.y + player.height > canvas.height - 50) {
    player.y = canvas.height - 50 - player.height;
    player.velocity = 0;
  }

  // Отрисовка игрока
  ctx.drawImage(player.image, player.x, player.y, player.width, player.height);

  // Обновление и отрисовка препятствий
  obstacles.forEach((obstacle, index) => {
    obstacle.x -= gameSpeed;
    if (obstacle.x + obstacle.width < 0) {
      obstacles.splice(index, 1);
    } else {
      ctx.drawImage(images.obstacle, obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    }
  });

  // Обновление и отрисовка монет
  coins.forEach((coin, index) => {
    coin.x -= gameSpeed;
    if (coin.x + coin.width < 0) {
      coins.splice(index, 1);
    } else {
      ctx.drawImage(images.coin, coin.x, coin.y, coin.width, coin.height);
    }
  });

  // Проверка коллизий
  checkCollisions();

  // Отрисовка счета
  ctx.fillStyle = '#fff';
  ctx.font = '20px Arial';
  ctx.fillText(`Score: ${score}`, 20, 30);

  // Создание новых препятствий и монет
  if (Math.random() < 0.02) {
    createObstacle();
  }
  if (Math.random() < 0.01) {
    createCoin();
  }

  requestAnimationFrame(updateGame);
}

// Проверка коллизий
function checkCollisions() {
  obstacles.forEach(obstacle => {
    if (!isSuper &&
      player.x < obstacle.x + obstacle.width &&
      player.x + player.width > obstacle.x &&
      player.y < obstacle.y + obstacle.height &&
      player.y + player.height > obstacle.y) {
      lives--;
      updateHeartsDisplay(lives);
      if (lives <= 0) {
        gameOver();
      }
    }
  });

  coins.forEach((coin, index) => {
    if (player.x < coin.x + coin.width &&
      player.x + player.width > coin.x &&
      player.y < coin.y + coin.height &&
      player.y + player.height > coin.y) {
      score++;
      coins.splice(index, 1);
    }
  });
}

// Создание препятствия
function createObstacle() {
  const height = Math.random() * 50 + 50;
  const width = Math.random() * 50 + 50;
  const x = canvas.width;
  const y = canvas.height - height - 50;
  obstacles.push({ x, y, width, height });
}

// Создание монеты
function createCoin() {
  const size = 30;
  const x = canvas.width;
  const y = Math.random() * (canvas.height - size - 50);
  coins.push({ x, y, width: size, height: size });
}

// Обновление отображения сердец
function updateHeartsDisplay(lives) {
  const heartsContainer = document.getElementById('hearts');
  heartsContainer.innerHTML = '';
  for (let i = 0; i < lives; i++) {
    const heart = document.createElement('div');
    heart.className = 'heart';
    heartsContainer.appendChild(heart);
  }
}

// Конец игры
function gameOver() {
  alert(`Game Over! Your score: ${score}`);
  location.reload(); // Перезагрузка страницы для новой игры
}

// Обработчики событий для управления
document.addEventListener('keydown', (e) => {
  if (e.code === 'Space') {
    isJumping = true;
  } else if (e.code === 'KeyS') {
    player.superPower();
  }
});

document.addEventListener('keyup', (e) => {
  if (e.code === 'Space') {
    isJumping = false;
  }
});

canvas.addEventListener('touchstart', () => {
  isJumping = true;
});

canvas.addEventListener('touchend', () => {
  isJumping = false;
});

// Начало игры
document.getElementById('start-button').addEventListener('click', () => {
  document.getElementById('main-screen').style.display = 'none';
  document.getElementById('gameCanvas').style.display = 'block';
  document.getElementById('hearts').style.display = 'block';
  startGame();
});

function startGame() {
  initGame(selectedCharacter);
}

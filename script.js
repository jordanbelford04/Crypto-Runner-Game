document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');
  let selectedCharacter = 'cyborg';
  const characters = {
    cyborg: { image: new Image(), superpower: () => { /* Реализовать суперсилу */ } },
    cat: { image: new Image(), superpower: () => { /* Реализовать суперсилу */ } },
    dragon: { image: new Image(), superpower: () => { /* Реализовать суперсилу */ } },
    new: { image: new Image(), superpower: () => { /* Реализовать суперсилу */ } },
    robin: { image: new Image(), superpower: () => { /* Реализовать суперсилу */ } },
  };

  // Загрузка изображений при загрузке страницы
  window.addEventListener('load', () => {
    characters.cyborg.image.src = 'assets/cyborg.png';
    characters.cat.image.src = 'assets/cat.png';
    characters.dragon.image.src = 'assets/dragon.png';
    characters.new.image.src = 'assets/hero.png'; // Изображение нового героя
    characters.robin.image.src = 'assets/RobinGood.png'; // Изображение героя Robin Good
  });

  // Обработчик выбора персонажа
  const characterOptions = document.querySelectorAll('.character-option');
  characterOptions.forEach(option => {
    option.addEventListener('click', () => {
      if (option.getAttribute('data-character') !== 'locked') {
        characterOptions.forEach(opt => opt.classList.remove('selected'));
        option.classList.add('selected');
        selectedCharacter = option.getAttribute('data-character');
      }
    });
  });

  // Обработчик нажатия кнопки "Начать игру"
  document.getElementById('start-button').addEventListener('click', () => {
    document.getElementById('main-screen').style.display = 'none';
    document.getElementById('gameCanvas').style.display = 'block';
    document.getElementById('hearts').style.display = 'block';
    startGame();
  });

  function startGame() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const character = characters[selectedCharacter];
    const dragonWidth = 50;
    const dragonHeight = 50;
    let dragonX = 50;
    let dragonY = canvas.height - dragonHeight - 30;
    const gravity = 0.6;
    let velocity = 0;
    let jumping = false;
    let score = 0;
    let gameSpeed = 2;

    const obstacles = [];

    class Obstacle {
      constructor(x, width) {
        this.x = x;
        this.y = canvas.height - 30;
        this.width = width;
        this.height = 30;
        this.image = new Image();
        this.image.src = 'assets/obstacle.png';
      }

      draw() {
        ctx.drawImage(this.image, this.x, this.y - this.height, this.width, this.height);
      }

      update() {
        this.x -= gameSpeed;
        this.draw();
      }
    }

    function createObstacle() {
      const width = Math.random() * 50 + 20;
      const obstacle = new Obstacle(canvas.width, width);
      obstacles.push(obstacle);
    }

    function drawCharacter() {
      ctx.drawImage(character.image, dragonX, dragonY, dragonWidth, dragonHeight);
    }

    function updateGame() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      drawCharacter();

      if (jumping) {
        velocity -= 10;
        jumping = false;
      }

      velocity += gravity;
      dragonY += velocity;

      if (dragonY > canvas.height - dragonHeight - 30) {
        dragonY = canvas.height - dragonHeight - 30;
        velocity = 0;
      }

      obstacles.forEach((obstacle, index) => {
        obstacle.update();
        if (
          dragonX < obstacle.x + obstacle.width &&
          dragonX + dragonWidth > obstacle.x &&
          dragonY < obstacle.y &&
          dragonY + dragonHeight > obstacle.y - obstacle.height
        ) {
          gameOver();
        }
        if (obstacle.x + obstacle.width < 0) {
          obstacles.splice(index, 1);
          score++;
        }
      });

      if (Math.random() < 0.02) {
        createObstacle();
      }

      gameSpeed += 0.001;

      ctx.fillStyle = '#000';
      ctx.font = '20px Arial';
      ctx.fillText(`Score: ${score}`, 10, 30);

      requestAnimationFrame(updateGame);
    }

    function gameOver() {
      alert(`Game Over! Your score: ${score}`);
      location.reload();
    }

    document.addEventListener('keydown', (e) => {
      if (e.code === 'Space' && dragonY === canvas.height - dragonHeight - 30) {
        jumping = true;
      }
    });

    updateGame();
  }
});

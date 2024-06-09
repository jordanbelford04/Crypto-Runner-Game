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

// Остальной ваш JavaScript код здесь (функции, обработчики событий и т.д.)

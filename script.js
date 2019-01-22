// TODO разобраться с добавлением хвоста
// TODO разобраться с размерами рамки и канваса
// TODO причесать код
// TODO добавить подсчёт очков или не добавлять
// TODO сделать красиво
// TODO добавить глаза
// TODO как сделать с setTimeout
// TODO из-за сайд-ээфекта на запрет смены направления на противоположное не даёт со старта поехать назад

const canvas = document.querySelector(`canvas`);
const ctx = canvas.getContext(`2d`);
let timer = null;

const getRandomRange = (min, max) => {
  return min + Math.floor(Math.random() * (max - min + 1));
};

const game = {
  points: 0,
  lives: 1
};

const gameCanvas = {
  color: `green`,
  x: 0,
  y: 0,
  width: 840,
  height: 840,
  step: 20,
};

const border = {
  size: gameCanvas.step,
  color: `blue`
};

const snake = {
  color: `black`,
  direction: null,
  parts: [
    {
      x: 200,
      y: 20,
      color: `red`
    },
    {
      x: 180,
      y: 20,
      color: `black`
    },
    {
      x: 160,
      y: 20,
      color: `black`
    },
    {
      x: 140,
      y: 20,
      color: `black`
    },
    {
      x: 120,
      y: 20,
      color: `black`
    },
    {
      x: 100,
      y: 20,
      color: `black`
    },
    {
      x: 80,
      y: 20,
      color: `black`
    },
    {
      x: 60,
      y: 20,
      color: `black`
    },
    {
      x: 40,
      y: 20,
      color: `black`
    }
  ]
};

const apple = {
  color: `orange`,
  width: gameCanvas.step,
  height: gameCanvas.step,
  x: getRandomRange(1, gameCanvas.width / gameCanvas.step - 1) * gameCanvas.step,
  y: getRandomRange(1, gameCanvas.height / gameCanvas.step - 1) * gameCanvas.step
};

const startGame = () => {
  timer = setInterval(nextStep, 200);
};

const overGame = () => {
  game.lives -= 1;
  if (timer) {
    clearInterval(timer);
    timer = null;
    snake.direction = null;
    console.log(`Конец игры`);
  }
};

const render = (item) => {
  ctx.fillStyle = item.color;
  ctx.fillRect(item.x, item.y, item.width, item.height);
};

const renderSnake = () => {
  // ctx.fillStyle = snake.color;

  for (const part of snake.parts) {
    ctx.fillStyle = part.color;
    ctx.fillRect(part.x, part.y, gameCanvas.step, gameCanvas.step);
  }
};

const clear = (item) => {
  ctx.clearRect(item.x, item.y, item.width, item.height);
};

const generateApple = () => {
  apple.x = getRandomRange(1, gameCanvas.width / gameCanvas.step - 1) * gameCanvas.step;
  apple.y = getRandomRange(1, gameCanvas.height / gameCanvas.step - 1) * gameCanvas.step;
};

const isAppleEaten = () => {
  const firstPart = snake.parts[0];
  const firstPartX = firstPart.x;
  const firstPartY = firstPart.y;
  return (firstPartX === apple.x && firstPartY === apple.y);
};

const addNewSnakePart = () => {
  const lastPart = snake.parts[snake.parts.length - 1];
  const newPart = Object.assign({}, lastPart);

  if (snake.direction === `right`) {
    newPart.x = lastPart.x - gameCanvas.step;
  } else if (snake.direction === `left`) {
    newPart.x = lastPart.x + gameCanvas.step;
  } else if (snake.direction === `up`) {
    newPart.y = lastPart.y + gameCanvas.step;
  } else if (snake.direction === `down`) {
    newPart.y = lastPart.y - gameCanvas.step;
  }

  snake.parts.push(newPart);
};

// TODO не проводить полный цикл, до первого найденного
// TODO мэйби есть смысл перебирать с конца, потому что мы врезаемся в хвост
// TODO если я нажимаю лево из право тоже считает ошибкой. Почему?

const checkBumpIntoTail = (direction) => {
  const parts = snake.parts;
  const firstPart = parts[0];
  let isTailNear = false;

  if (direction === `left`) {
    isTailNear = parts.some((part) => part.x === firstPart.x - gameCanvas.step && part.y === firstPart.y);
  } else if (direction === `right`) {
    isTailNear = parts.some((part) => part.x === firstPart.x + gameCanvas.step && part.y === firstPart.y);
  } else if (direction === `down`) {
    isTailNear = parts.some((part) => part.y === firstPart.y + gameCanvas.step && part.x === firstPart.x);
  } else if (direction === `up`) {
    isTailNear = parts.some((part) => part.y === firstPart.y - gameCanvas.step && part.x === firstPart.x);
  }

  return isTailNear;
};

const checkBumpIntoWall = (direction) => {
  const parts = snake.parts;
  const firstPart = parts[0];
  let isWallNear = false;
  if (direction === `right`) {
    isWallNear = firstPart.x + gameCanvas.step === gameCanvas.width;
  } else if (direction === `left`) {
    isWallNear = firstPart.x - gameCanvas.step === 0;
  } else if (direction === `up`) {
    isWallNear = firstPart.y - gameCanvas.step === 0;
  } else if (direction === `down`) {
    isWallNear = firstPart.y + gameCanvas.step === gameCanvas.height;
  }

  return isWallNear;
};

const moveRight = (firstPart, lastPart, firstPartX, firstPartY) => {

  if (lastPart.y !== firstPartY) {
    lastPart.y = firstPartY;
  }

  if (firstPartX + gameCanvas.step !== snake.parts[1].x) {
    lastPart.x = firstPartX + gameCanvas.step;
    lastPart.color = `red`;
    firstPart.color = `black`;
    snake.parts.unshift(snake.parts.pop());
  }
};

const moveDown = (firstPart, lastPart, firstPartX, firstPartY) => {
  if (firstPartY + gameCanvas.step !== snake.parts[1].y) {
    lastPart.x = firstPartX;
    lastPart.y = firstPartY + gameCanvas.step;
    lastPart.color = `red`;
    firstPart.color = `black`;
    snake.parts.unshift(snake.parts.pop());
  }
};

const moveLeft = (firstPart, lastPart, firstPartX, firstPartY) => {
  if (lastPart.y !== firstPartY) {
    lastPart.y = firstPartY;
  }

  if (firstPartX - gameCanvas.step !== snake.parts[1].x) {
    lastPart.x = firstPartX - gameCanvas.step;
    lastPart.color = `red`;
    firstPart.color = `black`;
    snake.parts.unshift(snake.parts.pop());
  }
};

const moveUp = (firstPart, lastPart, firstPartX, firstPartY) => {
  if (firstPartY - gameCanvas.step !== snake.parts[1].y) {
    lastPart.x = firstPartX;
    lastPart.y = firstPartY - gameCanvas.step;
    lastPart.color = `red`;
    firstPart.color = `black`;
    snake.parts.unshift(snake.parts.pop());
  }
};

const checkSnakeMove = (direction) => {
  const firstPart = snake.parts[0];
  const lastPart = snake.parts[snake.parts.length - 1];
  const firstPartX = firstPart.x;
  const firstPartY = firstPart.y;

  if (direction === `right`) {
    moveRight(firstPart, lastPart, firstPartX, firstPartY);

  } else if (snake.direction === `down`) {
    moveDown(firstPart, lastPart, firstPartX, firstPartY);

  } else if (snake.direction === `left`) {
    moveLeft(firstPart, lastPart, firstPartX, firstPartY);


  } else if (snake.direction === `up`) {
    moveUp(firstPart, lastPart, firstPartX, firstPartY);
  }
};

const nextStep = () => {
  clear(gameCanvas);

  render(gameCanvas);

  // render border
  ctx.strokeStyle = border.color;
  ctx.lineWidth = border.size;
  ctx.strokeRect(gameCanvas.x + border.size / 2, gameCanvas.x + border.size / 2, gameCanvas.width, gameCanvas.height);

  renderSnake(snake);
  render(apple);

  if (checkBumpIntoTail(snake.direction) || checkBumpIntoWall(snake.direction)) {
    console.log(`Врезался`);
    overGame();
  }


  // snake movenment
  checkSnakeMove(snake.direction);


  // apple generate
  if (isAppleEaten()) {
    addNewSnakePart();
    generateApple();
  }
};

const checkKey = (key) => {
  if (key === `ArrowRight`) {
    snake.direction = `right`;
  } else if (key === `ArrowDown`) {
    snake.direction = `down`;
  } else if (key === `ArrowUp`) {
    snake.direction = `up`;
  } else if (key === `ArrowLeft`) {
    snake.direction = `left`;
  }
};

document.addEventListener(`keydown`, (evt) => {
  checkKey(evt.key);
});

startGame();

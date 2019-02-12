// TODO разобраться с добавлением хвоста
// TODO разобраться с размерами рамки и канваса
// TODO причесать код
// TODO добавить подсчёт очков или не добавлять
// TODO сделать красиво
// TODO добавить глаза
// TODO как сделать с setTimeout
// TODO из-за сайд-эффекта на запрет смены направления на противоположное не даёт со старта поехать назад
// TODO Яблоко не должно появляться там же, где змейка 0_o

const getRandomRange = (min, max) => {
  return min + Math.floor(Math.random() * (max - min + 1));
};

const gameField = {
  color: `green`,
  x: 0,
  y: 0,
  width: 800,
  height: 800,
  step: 20
};

const border = {
  size: gameField.step,
  color: `blue`
};

const snake = {
  color: `black`,
  direction: null,
  bodyColor: `black`,
  headColor: `red`,
  parts: [
    {
      x: 200,
      y: 20
    },
    {
      x: 200,
      y: 0
    }
  ]
};

const canvas = document.querySelector(`canvas`);
canvas.width = `${gameField.width}`;
canvas.height = `${gameField.height}`;
canvas.style.border = `solid ${border.size}px ${border.color}`;
const ctx = canvas.getContext(`2d`);
let timer = null;


const apple = {
  color: `orange`,
  width: gameField.step,
  height: gameField.step,
  x: getRandomRange(0, gameField.width / gameField.step - 1) * gameField.step,
  y: getRandomRange(0, gameField.height / gameField.step - 1) * gameField.step
};

const startGame = () => {
  timer = setInterval(nextStep, 200);
};

const render = (item) => {
  ctx.fillStyle = item.color;
  ctx.fillRect(item.x, item.y, item.width, item.height);
};

const renderSnake = (_snake) => {
  ctx.fillStyle = _snake.bodyColor;

  snake.parts.forEach((element, index) => {
    if (index === 0) {
      ctx.fillStyle = _snake.headColor;
    } else {
      ctx.fillStyle = _snake.bodyColor;
    }
    ctx.fillRect(element.x, element.y, gameField.step, gameField.step);
  });
};

const clear = (item) => {
  ctx.clearRect(item.x, item.y, item.width, item.height);
};

const generateApple = (apple) => {
  apple.x = getRandomRange(0, gameField.width / gameField.step - 1) * gameField.step;
  apple.y = getRandomRange(0, gameField.height / gameField.step - 1) * gameField.step;
};

const isAppleEaten = () => {
  const firstPart = snake.parts[0];
  const firstPartX = firstPart.x;
  const firstPartY = firstPart.y;
  return (firstPartX === apple.x && firstPartY === apple.y);
};

const addNewSnakePart = (snake) => {
  const lastPart = snake.parts[snake.parts.length - 1];
  const newPart = Object.assign({}, lastPart);

  if (snake.direction === `right`) {
    newPart.x = lastPart.x - gameField.step;
    newPart.y += 0;
  } else if (snake.direction === `left`) {
    newPart.x = lastPart.x + gameField.step;
    newPart.y += 0;
  } else if (snake.direction === `up`) {
    newPart.y = lastPart.y + gameField.step;
    newPart.x += 0;
  } else if (snake.direction === `down`) {
    newPart.y = lastPart.y - gameField.step;
    newPart.x += 0;
  }

  snake.parts.push(newPart);
};

// TODO не проводить полный цикл, до первого найденного
// TODO мэйби есть смысл перебирать с конца, потому что мы врезаемся в хвост
// TODO если я нажимаю лево из право тоже считает ошибкой. Почему?

const snakeMove = (direction) => {
  if (direction === null) {
    return;
  }
  const lastPart = snake.parts[snake.parts.length - 1];
  const firstPart = snake.parts[0];

  if (direction === `right`) {
    lastPart.x = firstPart.x + gameField.step;
    lastPart.y = firstPart.y + 0;
  } else if (direction === `down`) {
    lastPart.x = firstPart.x + 0;
    lastPart.y = firstPart.y + gameField.step;
  } else if (direction === `left`) {
    lastPart.x = firstPart.x - gameField.step;
    lastPart.y = firstPart.y + 0;
  } else if (direction === `up`) {
    lastPart.x = firstPart.x + 0;
    lastPart.y = firstPart.y - gameField.step;
  }

  snake.parts.unshift(snake.parts.pop());
};


const nextStep = () => {
  clear(gameField);
  render(gameField);
  renderSnake(snake);
  render(apple);

  if (isAppleEaten()) {
    addNewSnakePart(snake);
    generateApple(apple);
  }

  snakeMove(snake.direction);
};

const changeSnakeDirection = (key) => {
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
  changeSnakeDirection(evt.key);
});

startGame();

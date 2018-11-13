// TODO запретить поворот через себя, касания корпуса
// TODO поставить стены
// TODO разобраться с добавлением хвоста

const canvas = document.querySelector(`canvas`);
const ctx = canvas.getContext(`2d`);

const getRandomRange = (min, max) => {
  return min + Math.floor(Math.random() * (max - min + 1));
};

const gameCanvas = {
  color: `green`,
  x: 0,
  y: 0,
  width: 300,
  height: 300
};

const snake = {
  color: `black`,
  direction: `right`,
  parts: [
    {
      x: 70,
      y: 10,
      size: 10,
      color: `red`
    },
    {
      x: 60,
      y: 10,
      size: 10,
      color: `black`
    },
    {
      x: 50,
      y: 10,
      size: 10,
      color: `black`
    },
    {
      x: 40,
      y: 10,
      size: 10,
      color: `black`
    },
    {
      x: 30,
      y: 10,
      size: 10,
      color: `black`
    },
    {
      x: 20,
      y: 10,
      size: 10,
      color: `black`
    },
    {
      x: 10,
      y: 10,
      size: 10,
      color: `black`
    }
  ]
};

const apple = {
  color: `orange`,
  width: 10,
  height: 10,
  x: getRandomRange(0, 29) * 10,
  y: getRandomRange(0, 29) * 10
};

const renderSnake = () => {
  // ctx.fillStyle = snake.color;

  for (const part of snake.parts) {
    ctx.fillStyle = part.color;
    ctx.fillRect(part.x, part.y, part.size, part.size);
  }
};

const clear = (item) => {
  ctx.clearRect(item.x, item.y, item.width, item.height);
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
    newPart.x = lastPart.x - 10;
  } else if (snake.direction === `left`) {
    newPart.x = lastPart.x + 10;
  } else if (snake.direction === `up`) {
    newPart.y = lastPart.y + 10;
  } else if (snake.direction === `down`) {
    newPart.y = lastPart.y - 10;
  }

  snake.parts.push(newPart);
};

const checkBumpIntoTail = (direction) => {
  debugger;
  const parts = snake.parts;
  const firstPart = parts[0];
  let isTailNear = false;
  if (direction === `left`) {
    // TODO не проводить полный цикл, до первого найденного
    for (const part of parts) {
      if (part.x === firstPart.x - 10) {
        isTailNear = true;
      }
    }
  }

  return isTailNear;
};

const moveRight = (firstPart, lastPart, firstPartX, firstPartY) => {

  if (lastPart.y !== firstPartY) {
    lastPart.y = firstPartY;
  }

  if (firstPartX + 10 !== snake.parts[1].x) {
    lastPart.x = firstPartX + 10;
    lastPart.color = `red`;
    firstPart.color = `black`;
    snake.parts.unshift(snake.parts.pop());
  } else {
    moveLeft(firstPart, lastPart, firstPartX, firstPartY);
  }
};

const moveDown = (firstPart, lastPart, firstPartX, firstPartY) => {
  if (firstPartY + 10 !== snake.parts[1].y) {
    lastPart.x = firstPartX;
    lastPart.y = firstPartY + 10;
    lastPart.color = `red`;
    firstPart.color = `black`;
    snake.parts.unshift(snake.parts.pop());
  } else {
    moveUp(firstPart, lastPart, firstPartX, firstPartY);
  }
};

const moveLeft = (firstPart, lastPart, firstPartX, firstPartY) => {
  if (lastPart.y !== firstPartY) {
    lastPart.y = firstPartY;
  }

  if (firstPartX - 10 !== snake.parts[1].x) {
    lastPart.x = firstPartX - 10;
    lastPart.color = `red`;
    firstPart.color = `black`;
    snake.parts.unshift(snake.parts.pop());
    if (checkBumpIntoTail(`left`)) {
      console.log(`Врезался`);
    }
  } else {
    moveRight(firstPart, lastPart, firstPartX, firstPartY);
  }
};

const moveUp = (firstPart, lastPart, firstPartX, firstPartY) => {
  if (firstPartY - 10 !== snake.parts[1].y) {
    lastPart.x = firstPartX;
    lastPart.y = firstPartY - 10;
    lastPart.color = `red`;
    firstPart.color = `black`;
    snake.parts.unshift(snake.parts.pop());
  } else {
    moveDown(firstPart, lastPart, firstPartX, firstPartY);
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

  // render canvas
  ctx.fillStyle = gameCanvas.color;
  ctx.fillRect(gameCanvas.x, gameCanvas.y, gameCanvas.width, gameCanvas.height);

  renderSnake(snake);

  // render apple
  ctx.fillStyle = apple.color;
  ctx.fillRect(apple.x, apple.y, apple.width, apple.height);

  // snake movenment
  checkSnakeMove(snake.direction);


  // apple generate
  if (isAppleEaten()) {
    addNewSnakePart();
    generateApple();
  }
  setTimeout(() => {
    nextStep();
  }, 200);
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

const generateApple = () => {
  apple.x = getRandomRange(0, 29) * 10;
  apple.y = getRandomRange(0, 29) * 10;
};

document.addEventListener(`keydown`, (evt) => {
  checkKey(evt.key);
});

nextStep();

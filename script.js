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
      x: 30,
      y: 10,
      size: 10
    },
    {
      x: 20,
      y: 10,
      size: 10
    },
    {
      x: 10,
      y: 10,
      size: 10
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
  ctx.fillStyle = snake.color;

  for (const part of snake.parts) {
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
  if (snake.direction === `right`) {

    const firstPart = snake.parts[0];
    const lastPart = snake.parts[snake.parts.length - 1];
    const firstPartX = firstPart.x;
    const firstPartY = firstPart.y;

    if (lastPart.y !== firstPartY) {
      lastPart.y = firstPartY;
    }
    lastPart.x = firstPartX + 10;
    snake.parts.unshift(snake.parts.pop());

  } else if (snake.direction === `down`) {

    const firstPart = snake.parts[0];
    const lastPart = snake.parts[snake.parts.length - 1];
    const firstPartX = firstPart.x;
    const firstPartY = firstPart.y;
    lastPart.x = firstPartX;
    lastPart.y = firstPartY + 10;
    snake.parts.unshift(snake.parts.pop());

  } else if (snake.direction === `left`) {
    const firstPart = snake.parts[0];
    const lastPart = snake.parts[snake.parts.length - 1];
    const firstPartX = firstPart.x;
    const firstPartY = firstPart.y;

    if (lastPart.y !== firstPartY) {
      lastPart.y = firstPartY;
    }

    lastPart.x = firstPartX - 10;
    snake.parts.unshift(snake.parts.pop());

  } else if (snake.direction === `up`) {
    const firstPart = snake.parts[0];
    const lastPart = snake.parts[snake.parts.length - 1];
    const firstPartX = firstPart.x;
    const firstPartY = firstPart.y;
    lastPart.x = firstPartX;
    lastPart.y = firstPartY - 10;
    snake.parts.unshift(snake.parts.pop());
  }


  // apple generate
  if (isAppleEaten()) {
    addNewSnakePart();
    generateApple();
  }
  setTimeout(() => {
    nextStep();
  }, 100);
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

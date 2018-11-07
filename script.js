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

const initialItem = {
  color: `black`,
  parts: 1,
  x: 10,
  y: 10,
  width: 10,
  height: 10,
  direction: `down`
};

const apple = {
  color: `orange`,
  width: 10,
  height: 10,
  x: getRandomRange(0, 29) * 10,
  y: getRandomRange(0, 29) * 10
};

const render = (item) => {
  ctx.fillStyle = item.color;
  ctx.fillRect(item.x, item.y, item.width, item.height);
};

const clear = (item) => {
  ctx.clearRect(item.x, item.y, item.width, item.height);
};

const isAppleEaten = () => {
  return (initialItem.x === apple.x && initialItem.y === apple.y);
};

const nextStep = () => {
  clear(gameCanvas);
  render(gameCanvas);
  render(apple);
  render(initialItem);

  if (initialItem.direction === `right`) {
    initialItem.x = initialItem.x + 10;
  } else if (initialItem.direction === `left`) {
    initialItem.x = initialItem.x - 10;
  } else if (initialItem.direction === `up`) {
    initialItem.y = initialItem.y - 10;
  } else if (initialItem.direction === `down`) {
    initialItem.y = initialItem.y + 10;
  }

  if (isAppleEaten()) {
    generateApple();
  }
  setTimeout(() => {
    nextStep();
  }, 100);
};

const checkKey = (key) => {
  if (key === `ArrowRight`) {
    initialItem.direction = `right`;
  } else if (key === `ArrowDown`) {
    initialItem.direction = `down`;
  } else if (key === `ArrowUp`) {
    initialItem.direction = `up`;
  } else if (key === `ArrowLeft`) {
    initialItem.direction = `left`;
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

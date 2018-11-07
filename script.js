const canvas = document.querySelector(`canvas`);
const ctx = canvas.getContext(`2d`);

const gameCanvas = {
  color: `green`,
  x: 0,
  y: 0,
  width: 300,
  height: 300
};

const render = (item) => {
  ctx.fillStyle = item.color;
  ctx.fillRect(item.x, item.y, item.width, item.height);
};

render(gameCanvas);

const item = {
  color: `black`,
  parts: 1,
  x: 10,
  y: 10,
  width: 10,
  height: 10
};

const clear = () => {
  ctx.clearRect(gameCanvas.x, gameCanvas.y, gameCanvas.width, gameCanvas.height);
  render(gameCanvas);
};

render(item);

const checkKey = (key) => {
  if (key === `ArrowRight` && item.x + 10 !== gameCanvas.width) {
    clear(item);
    item.x = item.x + 10;
    render(item);
  } else if (key === `ArrowDown` && item.y + 10 !== gameCanvas.height) {
    clear(item);
    item.y = item.y + 10;
    render(item);
  } else if (key === `ArrowUp` && !!item.y) {
    clear(item);
    item.y = item.y - 10;
    render(item);
  } else if (key === `ArrowLeft` && !!item.x) {
    clear(item);
    item.x = item.x - 10;
    render(item);
  }
};

document.addEventListener(`keydown`, (evt) => {
  checkKey(evt.key);
});

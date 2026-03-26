import base from './base/base.js';
const log = console.log;

$(() => {
  $('div#overlay' ).on('click', () => base.popup.closePopup());
  $('button#chess').on('click', () => base.openLink('chess/chess.html'));

  // =====

  canvas = document.getElementById('canvas');
  ctx    = canvas.getContext('2d');
  applyStyles();

  ROWS = Math.round(canvas.height / CHAR_SIZE );
  COLS = Math.round(canvas.width  / CHAR_COVER);

  charGrid   = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
  colorGrid  = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
  weightGrid = Array.from({ length: ROWS }, () => Array(COLS).fill(false));

  drops = new Array(COLS).fill(null); // Позиции потоков (null = неактивен)
  animate();
});

const CHAR_SIZE        = 16;
const CHAR_COVER       = CHAR_SIZE + 0;
const WHITESPACECHANCE = 0.5;
const FIRSTCHAR        = 0x1000;
const RANGECHAR        = 500;

let canvas;
let ctx;
let ROWS;
let COLS;

// Сетки для хранения символов, цветов и стилей (null = пусто)
let charGrid;
let colorGrid;
let weightGrid;
let drops;

function applyStyles() {
  canvas.style.width  = '100vw';
  canvas.style.height = '100vh';
  let canvasComputedStyle = getComputedStyle(canvas);
  canvas.width  = parseInt(canvasComputedStyle.width , 10);
  canvas.height = parseInt(canvasComputedStyle.height, 10);
}

function getRandomChar() {
  return String.fromCodePoint(FIRSTCHAR + base.randInt(RANGECHAR));
}

function getRandomColorAndWeight() {
  const colorsCount = 5;
  let color, isBold;
  switch (base.randInt(colorsCount)) {
    case 0 : color = '#aa5555cc'; break;
    case 1 : color = '#55aa55cc'; break;
    case 2 : color = '#5555aacc'; break;
    case 3 : color = '#aaaa55cc'; break;
    default: color = '#aaaaaacc';
  }
  isBold = !base.randInt(2) ? true : false;
  return { color, isBold };
}

function animate() {
  // Генерация 'входа': случайный столбец и символ
  const currentChar = Math.random() < WHITESPACECHANCE ? ' ' : getRandomChar();

  // Сброс/инициализация позиции для случайного столбца
  drops[base.randInt(COLS)] = 0;

  // Обработка всех активных столбцов
  for (let x = 0; x < COLS; x++) {
    if (drops[x] === null) continue;

    let o = drops[x];

    // Случайный цвет и стиль для этого 'печатания'
    const { color, isBold } = getRandomColorAndWeight();

    // 'Печать' символа в позиции o (если в пределах экрана)
    if (o < ROWS) {
      charGrid  [o][x] = currentChar;
      colorGrid [o][x] = color;
      weightGrid[o][x] = isBold;
    }

    // Продвижение
    drops[x]++;

    // Сброс при достижении низа
    if (drops[x] >= ROWS) { drops[x] = 0; }
  }

  // Отрисовка
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {

      if (charGrid[r][c] !== null) {
        ctx.fillStyle = colorGrid[r][c];
        ctx.font = weightGrid[r][c]
          ? `bold ${CHAR_SIZE}px monospace`
          : `${CHAR_SIZE}px monospace`;
        ctx.fillText(charGrid[r][c], c * CHAR_COVER, (r + 1) * CHAR_SIZE);
      }
      
    }
  }

  setTimeout(animate, 30);
}

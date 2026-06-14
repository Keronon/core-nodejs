import base from '../base/base.js';
import cfg  from '../base/config.js';

$(() => {
  $('div#overlay'       ).on('click', () => base.popup.closePopup());
  $('button#new'        ).on('click', () => {
                                              setBoard(8, 8);
                                              setTimeout(() => setFigures(newClassicSet), 500);
                                              $('#game-input').val(newClassicSet);
                                            });
  $('button#flip'       ).on('click', () => flipBoard());
  $('button#undo'       ).on('click', () => undoMove());
  $('button#main'       ).on('click', () => base.openLink('../index.html'));
  $('button#save-record').on('click', () => setFigures($('#game-input').val()));
  $('button#save-size'  ).on('click', () => setBoard($('#board-x').val(), $('#board-y').val()));
  $('button#mark-dir-x' ).on('click', () => flipMarkDirX());
  $('button#mark-dir-y' ).on('click', () => flipMarkDirY());

  // =====

  flipMarkDirY();
  drawPieces();
  getGameNow()
    .done((data) => drawFigures(data))
    .fail((err)  => console.error('Ошибка в getGameNow : ', err));

  $('#game-input').on('input', function () {
    const pos = this.selectionStart;
    $(this).val(
      $(this).val()
             .replace(/[^pnbrqk_PNBRQK]/g, '')
             .padEnd(boardSize.length, '_')
             .slice(0, boardSize.length)
    );
    this.setSelectionRange(pos, pos);
  });

  $('#board-x').on('input', function () {
    $(this).val(
      $(this).val() <  1 ?  1 : 
      $(this).val() > 25 ? 25 :
      $(this).val()
    );
  });
  $('#board-y').on('input', function () {
    $(this).val(
      $(this).val() <  1 ?  1 : 
      $(this).val() > 25 ? 25 :
      $(this).val()
    );
  });

  // =====
  
  const getGame = () => {
    console.log(`func : ${getGame.name}`);
    $.get(cfg.apiPath + 'chess?getGame')
      .done  ((data) => drawFigures(data))
      .fail  ((err)  => console.error('Ошибка в getGame : ', err))
      .always(()     => setTimeout(() => getGame(), 0));
  };
  getGame();
});

const divMove   = (move         ) => `<p class="move">${move}</p>`;
const divSquare = (coord, color ) => `<div id="s${coord}" class="square ${color}"></div>`;
const divFigure = (coord, figure) => `<div id="f${coord}" class="figure">${figure}</div>`;
const divPiece  = (piece, figure) => `<div id="${piece}"  class="piece" >${figure}</div>`;
const divMark   = (mark         ) => `<p class="mark">${mark}</p>`;

const pieceSet = {
  // [↦] &#8614;
  // [↧] &#8615;
  _: '', // in piece set : [X] -> &#9932; in records [empty square] -> &#12276;
  K: '&#9812;', Q: '&#9813;', R: '&#9814;', B: '&#9815;', N: '&#9816;', P: '&#9817;',
  k: '&#9818;', q: '&#9819;', r: '&#9820;', b: '&#9821;', n: '&#9822;', p: '&#9823;'
};

const newClassicSet = 'rnbqkbnrpppppppp________________________________PPPPPPPPRNBQKBNR';

let boardSize = {
  x: 8,
  y: 8,
  get length() { return this.x * this.y; }
};
let map         = [];
let curSet      = '';
let setsCounter = 0;

let isFlipped      = false;
let isActive       = false;
let isFlippedMarkX = false;
let isFlippedMarkY = false;

function isBlack(coord) {
  return (coord % boardSize.x + Math.floor(coord / boardSize.x)) % 2 ;
}

function getFEN(pos) {
  const xOffset = pos % boardSize.x;
  const x = isFlippedMarkX ? boardSize.x + 96 - xOffset : xOffset + 97;
  const yOffset = Math.floor(pos / boardSize.x);
  const y = isFlippedMarkY ? boardSize.y - yOffset : yOffset + 1;
  return String.fromCharCode(x) + y;
}

function getGameNow() {
  console.log(`func : ${getGameNow.name}`);
  return $.get(cfg.apiPath + 'chess?getGameNow');
}

function setFigures(set) {
  console.log(`func : ${setFigures.name}`);
  return $.get(cfg.apiPath + 'chess?setFigures&set=' + set);
}

function flipBoard() {
  console.log(`func : ${flipBoard.name}`);

  map = new Array(boardSize.length);
  curSet = '';

  const xText = $('#mark-dir-x').html().split(' ↦ ');
  $('#mark-dir-x').html(xText[1] + ' ↦ ' + xText[0]);
  const yText = $('#mark-dir-y').html().split(' ↧ ');
  $('#mark-dir-y').html(yText[1] + ' ↧ ' + yText[0]);

  $('#board-mark-x').css('flex-direction', isFlipped ^ !isFlippedMarkX ? 'row-reverse'    : 'row'   );
  $('#board-mark-y').css('flex-direction', isFlipped ^ !isFlippedMarkY ? 'column-reverse' : 'column');
  isFlipped = !isFlipped;
  
  drawBoard();
  getGameNow()
    .done((data) => drawFigures(data))
    .fail((err)  => console.error('Ошибка в getGameNow : ', err));
}

function flipMarkDirX() {
  console.log(`func : ${flipMarkDirX.name}`);

  const xText = $('#mark-dir-x').html().split(' ↦ ');
  $('#mark-dir-x').html(xText[1] + ' ↦ ' + xText[0]);
  $('#board-mark-x').css('flex-direction', isFlipped ^ !isFlippedMarkX ? 'row-reverse' : 'row');
  
  isFlippedMarkX = !isFlippedMarkX;
}
function flipMarkDirY() {
  console.log(`func : ${flipMarkDirY.name}`);

  const yText = $('#mark-dir-y').html().split(' ↧ ');
  $('#mark-dir-y').html(yText[1] + ' ↧ ' + yText[0]);
  $('#board-mark-y').css('flex-direction', isFlipped ^ !isFlippedMarkY ? 'column-reverse' : 'column');

  isFlippedMarkY = !isFlippedMarkY;
}

function setBoard(xSquare, ySquare, isGot = false) {
  console.log(`func : ${setBoard.name}`);

  boardSize.x = xSquare;
  boardSize.y = ySquare;
  map = new Array(boardSize.length);
  curSet = '';

  const rootStyle = document.documentElement.style;
  rootStyle.setProperty('--board-xSquare', xSquare);
  rootStyle.setProperty('--board-ySquare', ySquare);

  $('#board-x').val(xSquare);
  $('#board-y').val(ySquare);
  
  drawBoard();

  if (!isGot) {
    return $.get(`${cfg.apiPath}chess?setBoard&x=${xSquare}&y=${ySquare}`);
  }
}

function drawPieces() {
  console.log(`func : ${drawPieces.name}`);

  $('#pieces').html('');
  for (let piece in pieceSet) {
    $('#pieces').append(divPiece(piece, piece == '_' ? '&#9932;' : pieceSet[piece]));
    $('#'+piece).draggable({
      start: (event, ui) => {
        isActive = true;
        $(event.target).css("opacity", 0);
      },
      stop: (event, ui) => {
        $(event.target).css("opacity", '');
      },
      containment: '#board',
      helper: 'clone',
      appendTo: 'body',
      scroll: false
    });
  }
}

function drawBoard() {
  console.log(`func : ${drawBoard.name}`);

  $('#board').html('');
  for (let coord = 0; coord < boardSize.length; coord++) {
    const posCoord = isFlipped ? boardSize.length - 1 - coord : coord;
    $('#board').append(divSquare(posCoord, isBlack(coord) ? 'black' : 'white'));
    $('#s'+posCoord).droppable({ drop: dropFigure });
  }

  drawMarks();
}

function dropFigure (event, ui) {
  const id = ui.draggable.attr('id');
  if (id[0] == 'f') {
    moveFigure(
      ui.draggable.attr('id').substring(1),
      this.id.substring(1), //event.target.attributes.id.value.substring(1)
    );
  } else {
    setFigure(this.id.substring(1), id);
  }
  isActive = false;
}

function drawMarks() {
  $('#board-mark-x').html('');
  let charPoint = 'a'.codePointAt(0);
  let maxChar = 'a';
  for (let coord = 0; coord < boardSize.x; coord++) {
    const char = String.fromCodePoint(charPoint);
    $('#board-mark-x').append(divMark(char));
    maxChar = char;
    charPoint += 1;
  }
  
  const xText = $('#mark-dir-x').html().split(' ↦ ');
  isFlipped ^ !isFlippedMarkX
    ? $('#mark-dir-x').html(xText[0] + ' ↦ ' + maxChar)
    : $('#mark-dir-x').html(maxChar  + ' ↦ ' + xText[1])

  $('#board-mark-y').html('');
  charPoint = 1;
  for (let coord = 0; coord < boardSize.y; coord++) {
    $('#board-mark-y').append(divMark(charPoint));
    maxChar = charPoint;
    charPoint += 1;
  }
  
  const yText = $('#mark-dir-y').html().split(' ↧ ');
  isFlipped ^ !isFlippedMarkY
    ? $('#mark-dir-y').html(yText[0] + ' ↧ ' + maxChar)
    : $('#mark-dir-y').html(maxChar  + ' ↧ ' + yText[1])
}

function drawFigures(data) {
  setsCounter == 99 ? setsCounter = 0 : setsCounter++;
  _drawFigures(data, setsCounter);
}
function _drawFigures(data, setsNum = 0) {
  console.log(`func : ${drawFigures.name}`);

  if (setsNum != setsCounter) {
    console.log(`- old set`);
    return;
  }
  if (isActive) {
    console.log(`- board is active`);
    setTimeout(() => _drawFigures(data, setsNum), 500);
    return;
  }
  if (!data) {
    console.log(`- void data`);
    return;
  }
  if (curSet == data.set) {
    console.log(`- same set`);
    return;
  }

  setBoard(data.field.x, data.field.y, true);

  $('#game-input').val(data.set);
  curSet = data.set;

  for (let coord = 0; coord < boardSize.length; coord++) {
    drawFigure(coord, data.set.charAt(coord));
  }

  drawRecords(data.moves);
}

function drawRecords() {
  $('#move-record').empty();
  if (!dataMoves[0]) return;

  for (let moveNum in dataMoves) {
    const move = dataMoves[moveNum];
    recordMove(
      `${+moveNum + 1} : ${
        move.fromFig == '_' ? '&#12276;' : pieceSet[move.fromFig]
      } ${getFEN(move.fromPos)} ${ move.fromPos == move.toPos ? '+!' : getFEN(move.toPos) } ${
        move.toFig   == '_' ? '&#12276;' : pieceSet[move.toFig]
      }`
    );
  }
}

function drawFigure(to, figure, isForce = false) {
  if (!isForce && map[to] == figure) return;

  $('#s' + to).html(divFigure(to, pieceSet[figure]));
  $('#f' + to).draggable({
    start: (event, ui) => { isActive = true; },
    containment: '#board'
  });
  map[to] = figure;
}

function recordMove(move) {
  $('#move-record').append(divMove(move));
  $('#move-record').scrollTop($('#move-record').prop('scrollHeight'));
}

function setFigure(to, figure) {
  console.log(`func : ${setFigure.name}(${to},${figure})`);

  if (map[to] == figure) return;

  drawFigure(to, figure);
  return $.get(`${cfg.apiPath}chess?setFigure&to=${to}&figure=${figure}`);
}

function moveFigure(from, to) {
  console.log(`func : ${moveFigure.name}(${from},${to}) [ ${map[from]} ]`);

  if (from == to) {
    drawFigure(to, map[from], true);
    return;
  }

  drawFigure(to, map[from]);
  drawFigure(from, '_');
  return $.get(`${cfg.apiPath}chess?moveFigure&from=${from}&to=${to}`);
}

function undoMove() {
  console.log(`func : ${undoMove.name}()`);

  if ($('#move-record').is(':empty')) return;

  return $.get(cfg.apiPath + 'chess?undoMove');
}

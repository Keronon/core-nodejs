import base from '../base/base.js';

$(() => {
  $('div#overlay'       ).on('click', () => base.popup.closePopup()       );
  $('button#new'        ).on('click', () => newGame()                     );
  $('button#flip'       ).on('click', () => flipBoard()                   );
  $('button#undo'       ).on('click', () => undoMove()                    );
  $('button#main'       ).on('click', () => base.openLink('../index.html'));
  $('button#save-record').on('click', () => setGame()                     );

  // =====

  setBoard(520, 520, 8, 8);
  setPieces();
  drawBoard();

  $('#game-input').on('input', function () {
    const pos = this.selectionStart;
    $(this).val( $(this).val().replace(/[^pnbrqk_PNBRQK]/g, '').padEnd(boardSize.length, '_').slice(0, boardSize.length) );
    this.setSelectionRange(pos, pos);
  });

  // =====
  
  const getSet = () => $.get(apiPath + 'chess?getFigures')
                        .done((set) => {
                          setsCounter == 99 ? setsCounter = 0 : setsCounter++;
                          setFigures(set, setsCounter);
                        })
                        .fail  ((err) => console.error('Ошибка в getSet : ', err))
                        .always(()    => setTimeout(() => getSet(), 500)         );
  getSet();
});

const apiPath   = 'https://keronon-schemata.vercel.app/api/';
const divMove   = (move         ) => `<p class="move">${move}</p>`;
const divSquare = (coord, color ) => `<div id="s${coord}" class="square ${color}"></div>`;
const divFigure = (coord, figure) => `<div id="f${coord}" class="figure">${figure}</div>`;
const divPiece  = (piece, figure) => `<div id="${piece}"  class="piece" >${figure}</div>`;

const pieceSet = {
  // &#12276; empty square
  // &#9932;  X
  K: '&#9812;',
  Q: '&#9813;',
  R: '&#9814;',
  B: '&#9815;',
  N: '&#9816;',
  P: '&#9817;',
  k: '&#9818;',
  q: '&#9819;',
  r: '&#9820;',
  b: '&#9821;',
  n: '&#9822;',
  p: '&#9823;',
  _: ''
};
const newClassicSet = 'rnbqkbnrpppppppp________________________________PPPPPPPPRNBQKBNR';

let boardSize = {
  width  : 520,
  height : 520,
  xSquare: 8,
  ySquare: 8,
  get size()   { return this.width   * this.height;  },
  get length() { return this.xSquare * this.ySquare; }
};
let map         = [];
let curSet      = '';
let setsCounter = 0;

let isFlipped = false;
let isActive  = false;

function isBlack(coord) {
  return (coord % boardSize.xSquare + Math.floor(coord / boardSize.xSquare)) % 2 ;
}

function getFEN(pos) {
  return String.fromCharCode(pos % boardSize.xSquare + 97) + String.fromCharCode(boardSize.xSquare - 1 - Math.floor(pos / boardSize.xSquare) + 49);
}

function loadGame(set) {
  $.get(apiPath + 'chess?setFigures&set=' + set);
}

function newGame() {
  loadGame(newClassicSet);
  $('#game-input').val(newClassicSet);
}

function setGame() {
  loadGame($('#game-input').val());
}

function flipBoard() {
  isFlipped = !isFlipped;
  map       = new Array(boardSize.length);
  curSet    = '';
  drawBoard();
  $('#board-mark-cols').css('flex-direction', isFlipped ? 'row-reverse'    : 'row'   );
  $('#board-mark-rows').css('flex-direction', isFlipped ? 'column-reverse' : 'column');
}

function setBoard(width, height, xSquare, ySquare) {
  console.log(`func : ${setBoard.name}`);

  boardSize.width   = width;
  boardSize.height  = height;
  boardSize.xSquare = xSquare;
  boardSize.ySquare = ySquare;
  map = new Array(boardSize.length);
  curSet = '';
  const rootStyle = document.documentElement.style;
  rootStyle.setProperty('--board-width'  , width  + 'px');
  rootStyle.setProperty('--board-height' , height + 'px');
  rootStyle.setProperty('--board-xSquare', xSquare);
  rootStyle.setProperty('--board-ySquare', ySquare);
}

function setPieces() {
  console.log(`func : ${setPieces.name}`);

  $('#pieces').html('');
  for (let piece in pieceSet) {
    $('#pieces').append(divPiece(piece, piece == '_' ? '&#9932;' : pieceSet[piece]));
    $('#'+piece).draggable({
      start: (event, ui) => { isActive = true; },
      containment: '#board'
    });
  }
}

function drawBoard() {
  console.log(`func : ${drawBoard.name}`);

  $('#board').html('');
  for (let coord = 0; coord < boardSize.length; coord++) {
    const posCoord = isFlipped ? boardSize.length - 1 - coord : coord;
    $('#board').append(divSquare(posCoord, isBlack(coord) ? 'black' : 'white'));
    $('#s'+posCoord).droppable({
      drop: function (event, ui) {
        const id = ui.draggable.attr('id');
        if (id[0] == 'f') {
          moveFigure(
            ui.draggable.attr('id').substring(1),
            this.id.substring(1), //event.target.attributes.id.value.substring(1)
          );
        } else {
          setFigure(this.id.substring(1), id);
          ui.draggable.attr('style', 'position: relative;');
        }
        isActive = false;
      }
    });
  }
}

function setFigures(data, setsNum) {
  console.log(`func : ${setFigures.name}`);

  if (setsNum != setsCounter) {
    console.log(`- old set`);
    return;
  }
  if (isActive) {
    console.log(`- board is active`);
    setTimeout(() => setFigures(data, setsNum), 500);
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

  $('#game-input').val(data.set);
  curSet = data.set;

  for (let coord = 0; coord < boardSize.length; coord++) {
    placeFigure(coord, data.set.charAt(coord));
  }

  $('#move-record').empty();
  if (!data.moves[0]) return;
  for (let moveNum in data.moves) {
    const move = data.moves[moveNum];
    recordMove(
      `${+moveNum + 1} : ${
        move.fromFig == '_' ? '&#12276;' : pieceSet[move.fromFig]
      } ${getFEN(move.fromPos)} ${ move.fromPos == move.toPos ? '+!' : getFEN(move.toPos) } ${
        move.toFig   == '_' ? '&#12276;' : pieceSet[move.toFig]
      }`
    );
  }
}

function placeFigure(to, figure, isForce = false) {
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

  placeFigure(to, figure);
  $.get(`${apiPath}chess?setFigure&to=${to}&figure=${figure}`);
}

function moveFigure(from, to) {
  console.log(`func : ${moveFigure.name}(${from},${to}) [ ${map[from]} ]`);

  if (from == to) {
    placeFigure(to, map[from], true);
    return;
  }

  placeFigure(to, map[from]);
  placeFigure(from, '_');
  $.get(`${apiPath}chess?moveFigure&from=${from}&to=${to}`);
}

function undoMove() {
  console.log(`func : ${undoMove.name}()`);

  if ($('#move-record').is(':empty')) return;

  $.get(apiPath + 'chess?undoMove');
}

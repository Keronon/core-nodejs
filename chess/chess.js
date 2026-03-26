import base from '../base/base.js';
const log = console.log;

$(() => {
    setBoard(520, 520, 8, 8);
    setPieces();
    drawBoard();
    setInterval(() => $.get('chess.php?getFigures', setFigures), 100);
    
    $('#game-input').on('input', function() {
        const pos = this.selectionStart;
        $(this).val($(this).val().replace(/[^pnbrqk_PNBRQK]/g, '').padEnd(boardSize.length, '_').slice(0, boardSize.length));
        this.setSelectionRange(pos, pos);
    });
})

const divMove   = (move         ) => `<p class="move">${move}</p>`;
const divSquare = (coord, color ) => `<div id="s${coord}" class="square ${color}"></div>`;
const divFigure = (coord, figure) => `<div id="f${coord}" class="figure">${figure}</div>`;
const divPiece  = (piece, figure) => `<div id="${piece}"  class="piece" >${figure}</div>`;

const pieceSet = {
    // &#12276; empty square
    // &#9932;  X
    'K': '&#9812;',
    'Q': '&#9813;',
    'R': '&#9814;',
    'B': '&#9815;',
    'N': '&#9816;',
    'P': '&#9817;',
    'k': '&#9818;',
    'q': '&#9819;',
    'r': '&#9820;',
    'b': '&#9821;',
    'n': '&#9822;',
    'p': '&#9823;',
    '_': ''
};
const newClassicSet = 'rnbqkbnrpppppppp________________________________PPPPPPPPRNBQKBNR';

let boardSize = {
    width  : 520,
    height : 520,
    xSquare: 8,
    ySquare: 8,
    get size() {
        return this.width * this.height;
    },
    get length() {
        return this.xSquare * this.ySquare;
    }
};
let map = [];
let curSet = '';

let isFlipped = false;
let isAction = false;

function isBlack(coord) {
    return (coord % boardSize.xSquare + Math.floor(coord / boardSize.xSquare)) % 2;
}

function getFEN(pos) {
    return String.fromCharCode(pos % boardSize.xSquare + 97) + String.fromCharCode(boardSize.xSquare - 1 - Math.floor(pos / boardSize.xSquare) + 49);
}

function loadGame(set) {
    $.get(`chess.php?setFigures&set=${set}`);
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
    map = new Array(boardSize.length);
    curSet = '';
    drawBoard();
    $('#board-mark-cols').css('flex-direction', isFlipped ? 'row-reverse'    : 'row');
    $('#board-mark-rows').css('flex-direction', isFlipped ? 'column-reverse' : 'column');
}

function setBoard(width, height, xSquare, ySquare) {
    log(`func : ${setBoard.name}`);
    
    boardSize.width   = width;
    boardSize.height  = height;
    boardSize.xSquare = xSquare;
    boardSize.ySquare = ySquare;
    map = new Array(boardSize.length);
    curSet = '';
    const rootStyle = document.documentElement.style;
    rootStyle.setProperty('--board-width'  , width +'px');
    rootStyle.setProperty('--board-height' , height+'px');
    rootStyle.setProperty('--board-xSquare', xSquare);
    rootStyle.setProperty('--board-ySquare', ySquare);
}

function setPieces() {
    log(`func : ${setPieces.name}`);
    
    $('#pieces').html('');
    for (let piece in pieceSet) {
        $('#pieces').append(divPiece(piece, piece == '_' ? '&#9932;' : pieceSet[piece]));
        $('#'+piece).draggable({
            start: (event, ui) => { isAction = true; },
            containment: '#board'
        });
    }
}

function drawBoard() {
    log(`func : ${drawBoard.name}`);

    $('#board').html('');
    for (let coord = 0; coord < boardSize.length; coord++) {
        const posCoord = isFlipped ? boardSize.length - 1 - coord : coord;
        $('#board').append(divSquare(posCoord, isBlack(coord) ? 'black' : 'white'));
        $('#s' + posCoord).droppable({
            drop: function (event, ui) {
                const id = ui.draggable.attr('id');
                if (id[0] == 'f') {
                    moveFigure(
                        ui.draggable.attr('id').substring(1),
                        this.id.substring(1) //event.target.attributes.id.value.substring(1)
                    );
                }
                else {
                    setFigure(
                        this.id.substring(1),
                        id
                    );
                    ui.draggable.attr('style', 'position: relative;');
                }
                isAction = false;
            }
        });
    }
}

function setFigures(data) {
    if (isAction) return;
    if (!data) return;
    
    let [set, ...moves] = data.split('-');
    if (curSet == set) return;
    
    log(`func : ${setFigures.name}`); // (${set})
    
    $('#game-input').val(set);
    curSet = set;
    
    //set = set.replace(/\s/g, '');
    for (let coord = 0; coord < boardSize.length; coord++) {
        placeFigure(coord, set.charAt(coord));
    }
    
    $('#move-record').empty();
    if (!moves[0]) return;
    for (let moveNum in moves) {
        const move = moves[moveNum].match(/(\d+)(.)(\d+)(.)/);
        recordMove(`${+moveNum + 1} : ${move[2] == '_'
                                        ? '&#12276;'
                                        : pieceSet[move[2]]} ${getFEN(move[1])} ${move[1] == move[3]
                                                                                  ? '+!'
                                                                                  : getFEN(move[3])} ${move[4] == '_'
                                                                                                       ? '&#12276;'
                                                                                                       : pieceSet[move[4]]}`);
    }
}

function placeFigure(to, figure, isForce = false) {
    //log(`func : ${placeFigure.name}(${to},${figure})`);
    if (!isForce && map[to] == figure) return;

    $('#s'+to).html(divFigure(to, pieceSet[figure]));
    $('#f'+to).draggable({
        start: (event, ui) => { isAction = true; },
        containment: '#board'
    });
    map[to] = figure;
}

function recordMove(move) {
    $('#move-record').append(divMove(move));
    $('#move-record').scrollTop($('#move-record').prop("scrollHeight"));
}

function setFigure(to, figure) {
    log(`func : ${setFigure.name}(${to},${figure})`);
    
    if (map[to] == figure) return;
    
    placeFigure(to, figure);
    $.get(`chess.php?setFigure&to=${to}&figure=${figure}`);
}

function moveFigure(from, to) {
    log(`func : ${moveFigure.name}(${from},${to}) [ ${map[from]} ]`);
    
    if (from == to) {
        placeFigure(to, map[from], true);
        return;
    }

    placeFigure(to, map[from]);
    placeFigure(from, '_');
    $.get(`chess.php?moveFigure&from=${from}&to=${to}`);
}

function undoMove() {
    log(`func : ${undoMove.name}()`);
    
    if ($('#move-record').is(':empty')) return;
    
    $.get('chess.php?undoMove');
}

window.openLink   = base.openLink;
window.closePopup = base.popup.closePopup;
window.flipBoard  = flipBoard;
window.newGame    = newGame;
window.setGame    = setGame;
window.undoMove   = undoMove;
window.setFigure  = setFigure;

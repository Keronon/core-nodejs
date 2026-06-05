import { replaceCharAt, Logger, Res, Ress } from '../core';
import { _Storage  } from './storage';

const log = new Logger('== board == >');
const noFig = '_';

/**
 * field size
 * 
 * @property {number} x - width of field
 * @property {number} y - height of field
 */
class Field {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

/**
 * record of chess move
 * 
 * @property {number} fromPos - position where from move starts
 * @property {string} fromFig - figure   that  move starts
 * @property {number} toPos   - position where to   move ends
 * @property {string} toFig   - figure   that  move ends
 */
class Move {
    fromPos: number;
    fromFig: string;
    toPos  : number;
    toFig  : string;

    constructor(fromPos: number, fromFig: string, toPos: number, toFig: string) {
        this.fromPos = fromPos;
        this.fromFig = fromFig;
        this.toPos   = toPos;
        this.toFig   = toFig;
    }
}

/**
 * type for storing game
 */
class Game {
    field: Field;
    set  : string;
    moves: Move[];
    
    constructor(field: Field, set: string, moves: Move[]) {
        this.field = field;
        this.set   = set;
        this.moves = moves;
    }

    static is(obj: any): boolean {
        return ('set' in obj) && ('moves' in obj);
    }
}

export class Board {
    stor: _Storage;
    game: Game;

    constructor(stor: _Storage) {
        this.stor = stor;
        this.game = this.stor.load() as Game;
    }

    setBoard(x: number, y: number): Res {
        log.info(this.setBoard.name, x, y);
        this.game.field.x = x;
        this.game.field.y = y;
        this.game.set = '';
        this.game.moves = [];
        this.stor.save(this.game);
        return Ress.ok();
    }

    setFigures(set: string): Res {
        log.info(this.setFigures.name);
        this.game.set = set;
        this.game.moves = [];
        this.stor.save(this.game);
        return Ress.ok();
    }

    getGame(): Game {
        log.info(this.getGame.name);
        return this.game;
    }

    setFigure(to: number, figure: string): Res {
        log.info(this.setFigure.name, to, figure);

        if (!this.game) {
            const msg = 'game is empty';
            log.warn(msg);
            return Ress.nok(undefined, msg);
        }

        const toFig: string | undefined = this.game.set.at(to);
        
        this.game.moves.push(new Move(to, figure, to, toFig ?? noFig));
        this.game.set = replaceCharAt(this.game.set, to, figure);
        
        this.stor.save(this.game);
        return Ress.ok();
    }

    moveFigure(from: number, to: number): Res {
        log.info(this.moveFigure.name, from, to);

        if (!this.game) {
            const msg = 'game is empty';
            log.warn(msg);
            return Ress.nok(undefined, msg);
        }

        const frFig: string | undefined = this.game.set.at(from);
        const toFig: string | undefined = this.game.set.at(to);
        
        this.game.moves.push(new Move(from, frFig ?? noFig, to, toFig ?? noFig));
        
        this.game.set = replaceCharAt(this.game.set, to  , frFig ?? noFig);
        this.game.set = replaceCharAt(this.game.set, from, noFig);
        
        this.stor.save(this.game);
        return Ress.ok();
    }

    undoMove(): Res {
        log.info(this.undoMove.name);

        if (!this.game) {
            const msg = 'game is empty';
            log.warn(msg);
            return Ress.nok(undefined, msg);
        }

        const move: Move | undefined = this.game.moves.pop();
        if (!move) {
            const msg = 'no moves to undo';
            log.warn(msg);
            return Ress.nok(undefined, msg);
        }
        
        this.game.set = replaceCharAt(this.game.set, +move.fromPos, move.fromFig);
        this.game.set = replaceCharAt(this.game.set, +move.toPos  , move.toFig);
        
        this.stor.save(this.game);
        return Ress.ok();
    }
}

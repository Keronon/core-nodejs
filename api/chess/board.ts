import { setCharAt, Logger } from '../core';
import { _Storage  } from './storage';

const log = new Logger('== board == > ');

/**
 * record of chess move
 * 
 * @property {string} fromPos - position where from move starts
 * @property {string} fromFig - figure   that  move starts
 * @property {string} toPos   - position where to   move ends
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
    set  : string;
    moves: Move[];
    
    constructor(set: string, moves: Move[]) {
        this.set   = set;
        this.moves = moves;
    }

    static is(obj: any): boolean {
        return ('set' in obj) && ('moves' in obj);
    }
}

export class Board {
    stor: _Storage;

    constructor(stor: _Storage) {
        this.stor = stor;
    }

    setFigures(set: string): void {
        log.info(this.setFigures.name);
        this.stor.save({set: set, moves: []} satisfies Game);
    }

    getFigures(): Game {
        log.info(this.getFigures.name);
        return this.stor.load() as Game;
    }

    setFigure(to: number, figure: string): void {
        log.info(this.setFigure.name, to, figure);

        const game : Game = this.stor.load() as Game;
        if (!game) { log.warn('game is empty'); return; }

        const toFig: string | undefined = game.set.at(to);
        
        game.moves.push(new Move(to, figure, to, toFig ?? '_'));
        game.set = setCharAt(game.set, to, figure);
        
        this.stor.save(game);
    }

    moveFigure(from: number, to: number): void {
        log.info(this.moveFigure.name, from, to);

        const game : Game = this.stor.load() as Game;
        if (!game) { log.warn('game is empty'); return; }

        const frFig: string | undefined = game.set.at(from);
        const toFig: string | undefined = game.set.at(to);
        
        game.moves.push(new Move(from, frFig ?? '_', to, toFig ?? '_'));
        
        game.set = setCharAt(game.set, to  , frFig ?? '_');
        game.set = setCharAt(game.set, from, '_');
        
        this.stor.save(game);
    }

    undoMove(): void {
        log.info(this.undoMove.name);

        const game: Game = this.stor.load() as Game;
        if (!game) { log.warn('game is empty'); return; }

        const move: Move | undefined = game.moves.pop();
        if (!move) return;
        
        game.set = setCharAt(game.set, +move.fromPos, move.fromFig);
        game.set = setCharAt(game.set, +move.toPos  , move.toFig);
        
        this.stor.save(game);
    }
}

import { setCharAt } from '../core';
import { IStorage }  from './storage';

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

    static is(obj: object): boolean {
        return ('set' in obj) && ('moves' in obj);
    }
}

export class Board {
    stor: IStorage;

    constructor(stor: IStorage) {
        this.stor = stor;
    }

    setFigures(set: string): void {
        this.stor.save({set: set, moves: []} satisfies Game);
    }

    getFigures(): object | Game {
        return this.stor.load();
    }

    setFigure(to: number, figure: string): void {
        const game : Game = this.stor.load() as Game;
        if (!game) { console.log('game is empty'); return; }
        const toFig: string = game.set.at(to);
        
        game.moves.push(new Move(to, figure, to, toFig));
        game.set = setCharAt(game.set, to, figure);
        
        this.stor.save(game);
    }

    moveFigure(from: number, to: number): void {
        const game : Game = this.stor.load() as Game;
        if (!game) { console.log('game is empty'); return; }
        const frFig: string = game.set.at(from);
        const toFig: string = game.set.at(to);
        
        game.moves.push(new Move(from, frFig, to, toFig));
        
        game.set = setCharAt(game.set, to  , frFig);
        game.set = setCharAt(game.set, from, '_');
        
        this.stor.save(game);
    }

    undoMove(): void {
        const game: Game = this.stor.load() as Game;
        if (!game) { console.log('game is empty'); return; }
        const move: Move = game.moves.pop();
        if (!move) return;
        
        game.set = setCharAt(game.set, +move.fromPos, move.fromFig);
        game.set = setCharAt(game.set, +move.toPos  , move.toFig);
        
        this.stor.save(game);
    }
}

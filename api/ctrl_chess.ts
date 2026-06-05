import express from 'express';

import { Ress } from './core';
import { Board } from './chess/board';

import * as Stors from './chess/storage';

//const stor = new Stors.StorSession('stor_sess');
const stor = new Stors.StorFile('./chess/', 'stor_file.json');
//const stor = new Stors.StorDB('mysql:host=localhost;dbname=Chess;charset=utf8', 'root', '');

const board = new Board(stor);

/**
 * core handler
 * 
 * @returns json-object of response
 */
export default async function handler(req: express.Request, res: express.Response): Promise<express.Response> {
    const func = Object.keys(req.query)[0];
    const data = req.query as Record<string, string>;
    const { promise, resolve } = Promise.withResolvers<express.Response>();

    switch (func) {
        case 'getGame': board.stor.calls.push( () => resolve(res.json(board.getGame())) );
            break;
        case 'getGameNow': return res.json(board.getGame());
        case 'setFigures': return res.json(board.setFigures( data.set               ));
        case 'setFigure' : return res.json(board.setFigure (+data.to  ,  data.figure));
        case 'moveFigure': return res.json(board.moveFigure(+data.from, +data.to    ));
        case 'undoMove'  : return res.json(board.undoMove  (                        ));
        case 'setBoard'  : return res.json(board.setBoard  (+data.x   , +data.y     ));
        case 'check'     : return res.json(Ress.ok    (func, data));
        default          : return res.json(Ress.un_req(func, data));
    }
    return await promise;
}

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { ReqError } from './core';
import * as Stors   from './chess/storage';
import { Board }    from './chess/board';

//const stor = new Stors.StorSession('stor_sess');
const stor = new Stors.StorFile('./chess/stor_file.json');
//const stor = new Stors.StorDB('mysql:host=localhost;dbname=Chess;charset=utf8', 'root', '');

const board = new Board(stor);

/**
 * core handler
 * 
 * @returns json-object of response
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
    return res.json({
        req_query: req.query,
        obj_keys : Object.keys(req.query)
    });

    switch (Object.keys(req.query)[0]) {
        case 'getFigures': return res.json(board.getFigures(                                                            )); break;
        case 'setFigures': return res.json(board.setFigures( req.query['set' ] as string                                )); break;
        case 'setFigure' : return res.json(board.setFigure (+req.query['to'  ]          ,  req.query['figure'] as string)); break;
        case 'moveFigure': return res.json(board.moveFigure(+req.query['from']          , +req.query['to']              )); break;
        case 'undoMove'  : return res.json(board.undoMove  (                                                            )); break;
        default: return res.json({code: '0-1', msg: 'unknown request'} satisfies ReqError);
    }
}

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { ReqError, corsHeaderOptions, corsHeaderBase } from './core';
import * as Stors   from './chess/storage';
import { Board }    from './chess/board';

const stor = new Stors.StorSession('stor_sess');
//const stor = new Stors.StorFile('./chess/', 'stor_file.json');
//const stor = new Stors.StorDB('mysql:host=localhost;dbname=Chess;charset=utf8', 'root', '');

const board = new Board(stor);

/**
 * core handler
 * 
 * @returns json-object of response
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method === 'OPTIONS') {
        return res.setHeaders(corsHeaderOptions).status(200).end()
    }

    res.setHeaders(corsHeaderBase);
    switch (Object.keys(req.query)[0]) {
        case 'check'     : return res.json({ req_query: req.query }                                                      );
        case 'getFigures': return res.json(board.getFigures(                                                            ));
        case 'setFigures': return res.json(board.setFigures( req.query['set' ] as string                                ));
        case 'setFigure' : return res.json(board.setFigure (+req.query['to'  ]          ,  req.query['figure'] as string));
        case 'moveFigure': return res.json(board.moveFigure(+req.query['from']          , +req.query['to']              ));
        case 'undoMove'  : return res.json(board.undoMove  (                                                            ));
        default: return res.json({code: '0-1', msg: 'unknown request'} satisfies ReqError);
    }
}

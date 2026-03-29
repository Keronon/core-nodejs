import type { VercelRequest, VercelResponse } from "@vercel/node";

const log = console.log;

/**
core handler

@returns json-object
*/
export default async function handler(req: VercelRequest, res: VercelResponse) {
    return req.query; //res.json({ set: '.p.p.p.pp.p.p.p..p.p.p.p................P.P.P.P..P.P.P.PP.P.P.P.' });
}

import type { VercelRequest, VercelResponse } from "@vercel/node";

const log = console.log;

/**
core handler

@returns json-object
*/
export default async function handler(req: VercelRequest, res: VercelResponse) {
    return res.json(req.query);
}

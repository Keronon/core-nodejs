import type { VercelRequest, VercelResponse } from '@vercel/node';

import { readFile } from 'fs/promises';

const log = console.log;

/**
core handler

@returns index-HTML-page (api.html)
*/
export default async function handler(req: VercelRequest, res: VercelResponse) {
    const path = require('path');
    const file = path.join(process.cwd(), 'api', 'api.html');
    const html = await readFile(file, 'utf8');
    return res.status(200).send(html);
}

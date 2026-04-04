import type { VercelRequest, VercelResponse } from '@vercel/node';

import { readFile } from 'fs/promises';
import { corsHeaderOptions } from './core';

/**
 * core handler
 * 
 * @returns filler index-HTML page (api.html)
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method === 'OPTIONS') {
        return res.setHeaders(corsHeaderOptions).status(200).end()
    }

    const path = require('path');
    const file = path.join(process.cwd(), 'api', 'api.html');
    const html = await readFile(file, 'utf8');
    return res.status(200).send(html);
}

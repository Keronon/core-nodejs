// @ts-ignore
import type { VercelRequest, VercelResponse } from "@vercel/node";
const log = console.log;

export default function handler(req: VercelRequest, res: VercelResponse) {
  return res.json({
    message: `<h1>I N D E X . T S</h1>>`,
  });
}

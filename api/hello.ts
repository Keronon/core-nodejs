// @ts-ignore
import type { VercelRequest, VercelResponse } from "@vercel/node";
const log = console.log;

export default function handler(req: VercelRequest, res: VercelResponse) {
  log('_REQUEST_ :', req, '\n\n\n_RESPONSE_ :', res);
  
  const { name = "World" } = req.query;
  return res.json({
    message: `Hello, ${name}!`,
  });
}

import type { VercelRequest, VercelResponse } from "@vercel/node";
const log = console.log;

export default function handler(req: VercelRequest, res: VercelResponse) {
  log(req, '\n', res);
  
  const { name = "World" } = req.query;
  return res.json({
    message: `Hello, ${name}!`,
  });
}

// @ts-ignore
import type { VercelRequest, VercelResponse } from "@vercel/node";
const log = console.log;

export default function handler(req: VercelRequest, res: VercelResponse) {
  return res.json({
    message: `Goodbye, Human!`,
  });
}

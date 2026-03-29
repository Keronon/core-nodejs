import type { VercelRequest, VercelResponse } from "@vercel/node";
import fs   from "fs/promises";
import path from "path";
const log = console.log;

export default async function handler(req: VercelRequest, res: VercelResponse) {
    const file = path.join(process.cwd(), "api.html");
    const html = await fs.readFile(file, "utf8");

    return res.status(200).send(html);
    // return res.json({ message: `msg` });
}

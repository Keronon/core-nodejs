import type { VercelRequest, VercelResponse } from "@vercel/node";
import fs   from "fs/promises";
import path from "path";
const log = console.log;

export default async function handler(req: VercelRequest, res: VercelResponse) {
    //const file = path.join(process.cwd(), "api.html");
    //const html = await fs.readFile(file, "utf8");

    return res.status(200).send(printDirStructure(process.cwd()));
    // return res.json({ message: `msg` });
}

function printDirStructure(dir: string, prefix = ''): string {
    let struct = '';
    const files = fs.readdirSync(dir);
    
    files.forEach((file: string, index: number) => {
        const filePath = path.join(dir, file);
        const isLast = index === files.length - 1;
        const connector = isLast ? '└── ' : '├── ';
        
        struct += prefix + connector + file;
        
        if (fs.statSync(filePath).isDirectory()) {
            const newPrefix = prefix + (isLast ? '    ' : '│   ');
            printDirStructure(filePath, newPrefix);
        }
    });

    return struct;
}

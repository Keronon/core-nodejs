import type { VercelRequest, VercelResponse } from "@vercel/node";
import fs   from "fs";
import path from "path";
const log = console.log;

export default async function handler(req: VercelRequest, res: VercelResponse) {
    //const file = path.join(process.cwd(), "api", "api.html");
    //const html = await fs.promises.readFile(file, "utf8");

    return res.status(200).send(printDirStructure('../')); // process.cwd()
    // return res.json({ message: `msg` });
}

function printDirStructure(dir: string, prefix = '', struct = ''): string {
    const files = fs.readdirSync(dir);
    
    files.forEach((file: string, index: number) => {
        const filePath = path.join(dir, file);
        const isLast = index === files.length - 1;
        const connector = isLast ? '└── ' : '├── ';
        
        struct += prefix + connector + file + '<br/>';
        
        if (fs.statSync(filePath).isDirectory()) {
            const newPrefix = prefix + (isLast ? '    ' : '│   ');
            struct = printDirStructure(filePath, newPrefix, struct);
        }
    });

    return struct;
}

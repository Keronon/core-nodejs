import fs   from "fs";
import path from "path";

/**
creates string-object that contains dir-files structure from "dir"-position recursively
crashes if dir unexists

@param dir for root : './' = process.cwd()
*/
export function getDirStructure(dir: string, prefix: string = '', struct: string = ''): string {
    const files = fs.readdirSync(dir);
    
    files.forEach((file: string, index: number) => {
        const filePath = path.join(dir, file);
        const isLast = index === files.length - 1;
        const connector = isLast ? '└── ' : '├── ';
        
        struct += prefix + connector + file + '<br/>';
        
        if (fs.statSync(filePath).isDirectory()) {
            const newPrefix = prefix + (isLast ? '    ' : '│   ');
            struct = getDirStructure(filePath, newPrefix, struct);
        }
    });

    return struct;
}

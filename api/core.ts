import * as fs  from 'fs';
import { join } from 'path';

import handler from './index';
export default handler;

export const corsHeaderOptions = new Headers({
    'Access-Control-Allow-Origin' : 'https://keronon.github.io',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
});
export const corsHeaderBase = new Headers({
    'Access-Control-Allow-Origin' : 'https://keronon.github.io'
});

export type ReqError = {
    code: string;
    msg : string;
} 

/**
 * creates string-object that contains dir-files structure from "dir"-position recursively
 * 
 * crashes if dir unexists
 * 
 * @param dir - start path-point to create dir-file structure (for root : './' or process.cwd())
 */
export function getDirStructure(dir: string, prefix: string = '', struct: string = ''): string {
    const files = fs.readdirSync(dir);
    
    files.forEach((file: string, index: number) => {
        const filePath = join(dir, file);
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

export function setCharAt(str: string, index: number, char: string): string {
    if (index < 0 || index >= str.length) {
        throw new Error("Индекс вне диапазона");
    }
    return str.slice(0, index) + char + str.slice(index + 1);
}

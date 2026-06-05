import { join } from 'path';
import * as fs  from 'fs';

export type Res = {
    code: string;
    msg : string;
    func: string;
    data: {};
};
/**
 * @returns objects of {@link Res}
 * @params overwrite Res fields
 */
export const Ress = {
    un_req(func?: string, data?: {}): Res {
        return {code: '1-404', msg: 'unknown request', func: func ?? '_', data: data ?? '_'};
    },
    ok(func?: string, data?: {}): Res {
        return {code: '0-0', msg: 'ok', func: func ?? '_', data: data ?? '_'};
    },
    nok(func?: string, data?: {}): Res {
        return {code: '1-500', msg: 'nok', func: func ?? '_', data: data ?? '_'};
    }
}

/**
 * creates console-object with prepared prefix
 */
export class Logger {
    private _prefix: string;
        
    constructor(prefix: string) {
        this._prefix = prefix;
    }

    info(...msg: any[]): void {
        console.log(this._prefix, ...msg);
    }

    warn(...msg: any[]): void {
        console.warn(this._prefix, ...msg);
    }

    err(...msg: any[]): void {
        console.error(this._prefix, ...msg);
    }
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

/**
 * inserts some char to position inside of string
 */
export function replaceCharAt(str: string, index: number, char: string): string {
    if (index < 0 || index >= str.length) {
        throw new Error("Индекс вне диапазона");
    }
    return str.slice(0, index) + char + str.slice(index + 1);
}

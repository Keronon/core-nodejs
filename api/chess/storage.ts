import * as FS   from 'fs/promises';
import * as Path from 'path';

import { Logger } from '../core';

const log = new Logger('== storage == >');

export abstract class _Storage {
    protected stor_name: string     = '';
    public    calls    : Function[] = [];
    
    public abstract save(obj: any): void;
    public abstract load(): any;

    protected upCalls(): void{
        this.calls.forEach(call => call());
        this.calls.length = 0;
    }
}

type Sessions = Record<string, any>;
export class StorSession extends _Storage {
    private static sessions: Sessions = [];

    constructor(stor_name: string) {
        super();
        this.stor_name = stor_name;
    }

    save(obj: any): void {
        StorSession.sessions[this.stor_name] = obj;
        this.upCalls();
    }

    load(): any {
        return StorSession.sessions[this.stor_name];
    }
}

/**
 * useless with serverless function
 */
export class StorFile extends _Storage {
    constructor(path: string, file: string) {
        super();
        this.stor_name = Path.join('/tmp', path, file);

        FS.access(this.stor_name).catch(() => {
            const dir = Path.dirname(this.stor_name);
            log.warn('dir is : ' + dir);

            FS.mkdir(dir, { recursive: true })
              .then (async ()  => {
                  log.warn("mkdir + writeFile");
                  await FS.writeFile(this.stor_name, '', 'utf-8');
                  log.warn(await FS.access(this.stor_name));
              })
              .catch(err => log.err( 'ERROR on MkDir:', this.stor_name, err ));
        });
    }

    async save(obj: any): Promise<void> {
        await FS.writeFile(this.stor_name, JSON.stringify(obj, null, 2), 'utf-8');
        this.upCalls();
    }

    /**
     * @returns stored value or error
     */
    async load(): Promise<any> {
        let val: any;
        const file = await FS.readFile(this.stor_name, 'utf-8');
        val = JSON.parse(file);
        return val;
    }
}

/**
 * TODO:
export class StorDB extends IStorage {
    private pdo: PDO;

    constructor(dns, user, pass) {
        super();
        this.pdo = new PDO(dns, user, pass);
    }

    save(obj: any): void {
        this.pdo.prepare('UPDATE board SET figs = ?').execute(array(data));
        this.upCalls();
    }

    load(): any {
        return this.pdo.query('SELECT figs FROM board ORDER BY id').fetch()[0];
    }
}
 */

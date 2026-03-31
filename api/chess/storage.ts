import * as FS   from 'fs/promises';
import * as Path from 'path';

export interface IStorage {
    save(obj: object): void;
    load(): object;
}

export class StorSession implements IStorage {
    private stor_name: string;
    private static sessions: object[];

    constructor(stor_name: string) {
        this.stor_name = stor_name;
    }

    save(obj: object): void {
        StorSession.sessions[this.stor_name] = obj;
    }

    load(): object {
        return StorSession.sessions[this.stor_name];
    }
}

export class StorFile implements IStorage {
    private file: string;

    constructor(file_path: string) {
        this.file = Path.join(process.cwd(), 'api', file_path);

        FS.access(this.file).catch(() => {
            const dir = Path.dirname(this.file);
            console.log('dir is : ' + dir);
            FS.mkdir(dir, { recursive: true })
            .then ((   ) => { return FS.writeFile(this.file, '', 'utf-8'); })
            .catch((err) => { console.log( 'ERROR on MkDir: ' + err );     });
        });
    }

    save(obj: object): void {
        FS.writeFile(this.file, JSON.stringify(obj, null, 2), 'utf-8');
    }

    /**
     * @returns stored object or error
     */
    load(): object {
        let obj: Object;
        (async () => {
            const file = await FS.readFile(this.file, 'utf-8');
            obj = JSON.parse(file);
        })();
        return obj;
    }
}

/**
 * TODO:
export class StorDB implements IStorage {
    private pdo: PDO;

    constructor(dns, user, pass) {
        this.pdo = new PDO(dns, user, pass);
    }

    save(obj: object): void {
        this.pdo.prepare('UPDATE board SET figs = ?').execute(array(data));
    }

    load(): object {
        return this.pdo.query('SELECT figs FROM board ORDER BY id').fetch()[0];
    }
}
 */

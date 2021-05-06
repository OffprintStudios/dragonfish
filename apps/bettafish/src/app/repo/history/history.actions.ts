export namespace History {
    export class Fetch {
        static readonly type = '[History] Fetch';
    }

    export class Select {
        static readonly type = '[History] Select';
        constructor(public docId: string) {}
    }

    export class Deselect {
        static readonly type = '[History] Deselect';
        constructor(public docId: string) {}
    }

    export class Delete {
        static readonly type = '[History] Delete';
        constructor(public docIds: string[]) {}
    }
}

export namespace Global {
    export class SetContentFilter {
        static readonly type = '[Global] Set Content Filter';
        constructor(public enableMature: boolean, public enableExplicit: boolean) {}
    }
}

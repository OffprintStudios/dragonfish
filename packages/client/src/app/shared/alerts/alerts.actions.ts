export namespace Alerts {
    export class Success {
        static readonly type = '[Alerts] Success';
        constructor(public message: string) {}
    }

    export class Error {
        static readonly type = '[Alerts] Error';
        constructor(public message: string) {}
    }

    export class Info {
        static readonly type = '[Alerts] Info';
        constructor(public message: string) {}
    }

    export class Warning {
        static readonly type = '[Alerts] Warning';
        constructor(public message: string) {}
    }
}

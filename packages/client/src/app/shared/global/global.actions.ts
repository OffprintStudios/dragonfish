import { Themes } from "../../models/site";

export namespace Global {
    export class ChangeTheme {
        static readonly type = '[App] Change Theme';
        constructor (public pref: Themes.Preference) {}
    }

    export class SetContentFilter {
        static readonly type = '[App] Set Content Filter';
        constructor () {}
    }
}
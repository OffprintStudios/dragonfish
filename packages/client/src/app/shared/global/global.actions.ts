import { Themes } from "../../models/site";

export namespace Global {
    export class ChangeTheme {
        static readonly type = '[Global] Change Theme';
        constructor (public pref: Themes.Preference) {}
    }

    export class SetContentFilter {
        static readonly type = '[Global] Set Content Filter';
        constructor () {}
    }
}
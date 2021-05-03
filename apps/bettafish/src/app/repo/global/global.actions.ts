import { ThemePref } from '@dragonfish/shared/models/users';

export class SetOfAge {
    static readonly type = '[Global] Set Of Age';
}

export class SetContentFilter {
    static readonly type = '[Global] Set Content Filter';
    constructor(public enableMature: boolean, public enableExplicit: boolean) {}
}

export class SetThemePref {
    static readonly type = '[Global] Set Theme Preference';
    constructor(public newPref: ThemePref) {}
}

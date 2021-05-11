import { Collection, CollectionForm } from '@dragonfish/shared/models/collections';

export class Create {
    static readonly type = '[Collections] Create';
    constructor(public formInfo: CollectionForm) {}
}

export class Edit {
    static readonly type = '[Collections] Edit';
    constructor(public id: string, public formInfo: CollectionForm) {}
}

export class Delete {
    static readonly type = '[Collections] Delete';
    constructor(public id: string) {}
}
export class SetVisibility {
    static readonly type = '[Collections] Set Visibility';
    constructor(public id: string) {}
}

export class SetCurrent {
    static readonly type = '[Collections] Set Current';
    constructor(public current: Collection) {}
}

export class FetchAll {
    static readonly type = '[Collections] Fetch All';
}

export class AddContent {
    static readonly type = '[Collections] Add Content';
    constructor(public id: string, public contentId: string) {}
}

export class RemoveContent {
    static readonly type = '[Collections] Remove Content';
    constructor(public id: string, public contentId: string) {}
}

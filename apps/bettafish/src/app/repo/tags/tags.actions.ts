import { Tag, TagsForm } from '@dragonfish/shared/models/tags';

export class Create {
    static readonly type = '[Tags] Create';
    constructor(public formInfo: TagsForm) {}
}

import { ContentKind, ContentModel } from '@dragonfish/shared/models/content';

export interface WorkFormData {
    kind: ContentKind;
    content?: ContentModel;
}

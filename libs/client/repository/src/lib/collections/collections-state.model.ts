import { Collection } from '@dragonfish/shared/models/collections';

export interface CollectionsStateModel {
    collections: Collection[];
    loading: boolean;
    currCollection: Collection;
}

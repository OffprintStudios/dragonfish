import { Injectable } from '@angular/core';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { Collection, CollectionForm } from '@dragonfish/shared/models/collections';
import * as Collections from '../collections.actions';

@Injectable({ providedIn: 'root' })
export class CollectionsService {
    @Dispatch()
    public create = (formInfo: CollectionForm) => new Collections.Create(formInfo);

    @Dispatch()
    public edit = (id: string, formInfo: CollectionForm) => new Collections.Edit(id, formInfo);

    @Dispatch()
    public delete = (id: string) => new Collections.Delete(id);

    @Dispatch()
    public setVisibility = (id: string) => new Collections.SetVisibility(id);

    @Dispatch()
    public setCurrent = (current: Collection) => new Collections.SetCurrent(current);

    @Dispatch()
    public fetchAll = () => new Collections.FetchAll();

    @Dispatch()
    public addContent = (id: string, contentId: string) => new Collections.AddContent(id, contentId);

    @Dispatch()
    public removeContent = (id: string, contentId: string) => new Collections.RemoveContent(id, contentId);
}

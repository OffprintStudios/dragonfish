import { Injectable } from '@angular/core';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { History } from '../history.actions';

@Injectable({ providedIn: 'root' })
export class HistoryService {
    @Dispatch()
    public fetch = () => new History.Fetch();

    @Dispatch()
    public select = (docId: string) => new History.Select(docId);

    @Dispatch()
    public deselect = (docId: string) => new History.Deselect(docId);

    @Dispatch()
    public delete = (docIds: string[]) => new History.Delete(docIds);
}

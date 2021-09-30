import { Injectable } from '@angular/core';
import { DragonfishNetworkService } from '@dragonfish/client/services';
import { PseudonymsQuery } from '@dragonfish/client/repository/pseudonyms';
import { ContentKind, FormType } from '@dragonfish/shared/models/content';

@Injectable({ providedIn: 'root' })
export class WorkPageService {
    constructor(private network: DragonfishNetworkService, private pseudQuery: PseudonymsQuery) {}

    //#region ---CRUD OPERATIONS---

    public createWork(kind: ContentKind, formInfo: FormType) {
        return this.network.createContent(this.pseudQuery.currentId, kind, formInfo);
    }

    //#endregion
}

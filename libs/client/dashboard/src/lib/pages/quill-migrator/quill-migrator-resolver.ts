import { Injectable } from "@angular/core";
import { Resolve } from "@angular/router";
import { ContentModel } from "@dragonfish/shared/models/content";
import { OldDataService } from "./old-data-service";

@Injectable()
export class QuillMigratorResolver implements Resolve<ContentModel[]> {
    constructor(private readonly oldDataService: OldDataService) { }

    async resolve(): Promise<ContentModel[]> {
        return await this.oldDataService.getOldContent();
    }
}

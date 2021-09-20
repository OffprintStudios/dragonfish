import { Injectable } from '@angular/core';
import { DragonfishNetworkService } from '@dragonfish/client/services';
import { ContentKind } from '@dragonfish/shared/models/content';

@Injectable()
export class ContentService {
    constructor(private network: DragonfishNetworkService) {}

    public fetchBlogs(profileId: string) {
        return this.network.fetchAllByKind(profileId, [ContentKind.BlogContent]);
    }

    public fetchWorks(profileId: string) {
        return this.network.fetchAllByKind(profileId, [ContentKind.ProseContent, ContentKind.PoetryContent]);
    }
}

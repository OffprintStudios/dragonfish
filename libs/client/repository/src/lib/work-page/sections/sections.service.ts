import { Injectable } from '@angular/core';
import { SectionsStore } from './sections.store';
import { SectionsQuery } from './sections.query';
import { DragonfishNetworkService } from '@dragonfish/client/services';
import { AlertsService } from '@dragonfish/client/alerts';
import { Section } from '@dragonfish/shared/models/sections';

@Injectable({ providedIn: 'root' })
export class SectionsService {
    constructor(
        private sectionsStore: SectionsStore,
        private sectionsQuery: SectionsQuery,
        private network: DragonfishNetworkService,
        private alerts: AlertsService,
    ) {}

    public setSections(sections: Section[]) {
        this.sectionsStore.set(sections);
        this.sectionsStore.update({
            pubSecList: sections.filter((item) => {
                return item.published === true;
            }),
        });
    }

    public setActive(id: string) {
        this.sectionsStore.setActive(id);
    }
}

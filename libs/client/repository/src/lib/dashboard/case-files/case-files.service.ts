import { Injectable } from '@angular/core';
import { CaseFilesStore } from './case-files.store';
import { CaseFilesQuery } from './case-files.query';
import { DragonfishNetworkService } from '@dragonfish/client/services';
import { AlertsService } from '@dragonfish/client/alerts';

@Injectable({ providedIn: 'root' })
export class CaseFilesService {
    constructor(
        private caseFilesStore: CaseFilesStore,
        private caseFilesQuery: CaseFilesQuery,
        private network: DragonfishNetworkService,
        private alerts: AlertsService,
    ) {}
}

import { Component, OnInit } from '@angular/core';
import { CaseFilesService, CaseFilesQuery } from '@dragonfish/client/repository/dashboard/case-files';
import { ActionType, CaseKind } from '@dragonfish/shared/models/case-files';

@Component({
    selector: 'dragonfish-case-files',
    templateUrl: './case-files.component.html',
})
export class CaseFilesComponent implements OnInit {
    caseKind = CaseKind;
    actionType = ActionType;

    constructor(public caseQuery: CaseFilesQuery, private caseService: CaseFilesService) {}

    ngOnInit() {
        this.caseService.fetchAllActive().subscribe();
    }
}

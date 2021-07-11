import { Component, OnInit } from '@angular/core';
import { CaseKind, ActionType } from '@dragonfish/shared/models/case-files';
import { CaseFilesQuery, CaseFilesService } from '@dragonfish/client/repository/dashboard/case-files';

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

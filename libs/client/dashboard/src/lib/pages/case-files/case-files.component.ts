import { Component, OnInit } from '@angular/core';
import { CaseKind, ActionType } from '@dragonfish/shared/models/case-files';
import { CaseFilesQuery, CaseFilesService } from '@dragonfish/client/repository/dashboard/case-files';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'dragonfish-case-files',
    templateUrl: './case-files.component.html',
})
export class CaseFilesComponent implements OnInit {
    caseKind = CaseKind;
    actionType = ActionType;

    constructor(
        public caseQuery: CaseFilesQuery,
        private caseService: CaseFilesService,
        private router: Router,
        private route: ActivatedRoute,
    ) {}

    ngOnInit() {
        this.caseService.fetchAllActive().subscribe();
    }

    viewCase(id: number) {
        this.caseService.setCurrent(id);
        this.router.navigate(['view-file'], { relativeTo: this.route }).catch((err) => console.log(err));
    }
}

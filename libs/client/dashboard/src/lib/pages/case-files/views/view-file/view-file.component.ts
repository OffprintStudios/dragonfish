import { Component } from '@angular/core';
import { CaseFilesQuery } from '@dragonfish/client/repository/dashboard/case-files';

@Component({
    selector: 'dragonfish-view-file',
    templateUrl: './view-file.component.html',
})
export class ViewFileComponent {
    constructor(public fileQuery: CaseFilesQuery) {}
}

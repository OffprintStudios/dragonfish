import { Component } from '@angular/core';
import { ContentKind } from '@dragonfish/shared/models/content';
import { WorkFormComponent, WorkFormData } from '@dragonfish/client/ui';
import { MatDialog } from '@angular/material/dialog';

@Component({
    selector: 'dragonfish-works-list',
    templateUrl: './works-list.component.html',
    styleUrls: ['./works-list.component.scss'],
})
export class WorksListComponent {
    kind = ContentKind;

    constructor(private dialog: MatDialog) {}

    openForm(kind: ContentKind): void {
        const formData: WorkFormData = {
            kind: kind,
        };

        this.dialog.open(WorkFormComponent, { data: formData });
    }
}

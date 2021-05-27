import { Component, Input } from '@angular/core';
import { ChildTagsModel } from '@dragonfish/shared/models/content';
import { TagsService } from '@dragonfish/client/repository/dashboard/tags';
import { AlertsService } from '@dragonfish/client/alerts';
import { MatDialog } from '@angular/material/dialog';
import { ChildTagFormComponent } from '../child-tag-form/child-tag-form.component';
import { PopupModel } from '@dragonfish/shared/models/util';
import { PopupComponent } from '@dragonfish/client/ui';

@Component({
    selector: 'dragonfish-child-tag-item',
    templateUrl: './child-tag-item.component.html',
})
export class ChildTagItemComponent {
    @Input() parentId: string;
    @Input() tag: ChildTagsModel;

    constructor(
        private tagsService: TagsService,
        private alerts: AlertsService,
        private dialog: MatDialog,
    ) {}

    editTag() {
        this.dialog.open(ChildTagFormComponent, { data: { parentId: this.parentId, child: this.tag }});
    }

    removeTag() {
        const alertData: PopupModel = {
            message: 'Are you sure you want to remove this? This action is irreversible.',
            confirm: true,
        };
        const dialogRef = this.dialog.open(PopupComponent, { data: alertData });
        dialogRef.afterClosed().subscribe((wantsToDelete: boolean) => {
            if (wantsToDelete) {
                this.tagsService.removeChild(this.parentId, this.tag._id).subscribe();
            }
        });
    }
}

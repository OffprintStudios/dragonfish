import { Component, Input } from '@angular/core';
import { TagsService } from '@dragonfish/client/repository/dashboard/tags';
import { AlertsService } from '@dragonfish/client/alerts';
import { MatDialog } from '@angular/material/dialog';
import { PopupModel } from '@dragonfish/shared/models/util';
import { PopupComponent } from '@dragonfish/client/ui';
import { TagsModel } from '@dragonfish/shared/models/content';
import { TagFormComponent } from '..';

@Component({
    selector: 'dragonfish-child-tag-item',
    templateUrl: './child-tag-item.component.html',
})
export class ChildTagItemComponent {
    @Input() parentId: string;
    @Input() tag: TagsModel;

    constructor(
        private tagsService: TagsService,
        private alerts: AlertsService,
        private dialog: MatDialog,
    ) {}

    editTag() {
        this.dialog.open(TagFormComponent, { data: { tag: this.tag } });
    }

    removeTag() {
        const alertData: PopupModel = {
            message: 'Are you sure you want to remove this? This action is irreversible.',
            confirm: true,
        };
        const dialogRef = this.dialog.open(PopupComponent, { data: alertData });
        dialogRef.afterClosed().subscribe((wantsToDelete: boolean) => {
            if (wantsToDelete) {
                this.tagsService.deleteTag(this.tag._id).subscribe()
            }
        });
    }
}

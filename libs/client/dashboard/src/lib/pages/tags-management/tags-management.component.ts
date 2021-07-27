import { Component, OnInit } from '@angular/core';
import { TagsQuery, TagsService } from '@dragonfish/client/repository/dashboard/tags';
import { TagKind, TagsModel } from '@dragonfish/shared/models/content';
import { MatDialog } from '@angular/material/dialog';
import { ChildTagFormComponent, TagFormComponent } from '../../components/tags-management';
import { PopupModel } from '@dragonfish/shared/models/util';
import { PopupComponent } from '@dragonfish/client/ui';

@Component({
    selector: 'dragonfish-tags-management',
    templateUrl: './tags-management.component.html',
    styleUrls: ['./tags-management.component.scss'],
})
export class TagsManagementComponent implements OnInit {
    constructor(
        public tagsQuery: TagsQuery,
        private tagsService: TagsService,
        private dialog: MatDialog,
    ) {}

    ngOnInit(): void {
        this.tagsService.fetchTags(TagKind.Fandom).subscribe();
    }

    createTag() {
        this.dialog.open(TagFormComponent);
    }

    addChild(parentId: string) {
        const alertData: PopupModel = {
            message: 'Currently disabled',
            confirm: true,
        };
        const dialogRef = this.dialog.open(PopupComponent, { data: alertData });
        // this.dialog.open(ChildTagFormComponent, { data: { parentId: parentId }});
    }

    editTag(tag: TagsModel) {
        this.dialog.open(TagFormComponent, { data: { tag: tag } });
    }

    deleteTag(id: string) {
        const alertData: PopupModel = {
            message: 'Are you sure you want to delete this? This action is irreversible.',
            confirm: true,
        };
        const dialogRef = this.dialog.open(PopupComponent, { data: alertData });
        dialogRef.afterClosed().subscribe((wantsToDelete: boolean) => {
            if (wantsToDelete) {
                this.tagsService.deleteTag(id).subscribe();
            }
        });
    }
}

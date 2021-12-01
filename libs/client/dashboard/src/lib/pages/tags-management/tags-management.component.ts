import { Component, OnInit } from '@angular/core';
import { TagsQuery, TagsService } from '@dragonfish/client/repository/tags';
import { TagKind, TagsModel } from '@dragonfish/shared/models/content/tags';
import { MatDialog } from '@angular/material/dialog';
import { TagFormComponent } from '../../components/tags-management';
import { PopupModel } from '@dragonfish/shared/models/util';
import { PopupComponent } from '@dragonfish/client/ui';

@Component({
    selector: 'dragonfish-tags-management',
    templateUrl: './tags-management.component.html',
    styleUrls: ['./tags-management.component.scss'],
})
export class TagsManagementComponent implements OnInit {
    openPanelId: string;

    constructor(
        public tagsQuery: TagsQuery,
        private tagsService: TagsService,
        private dialog: MatDialog,
    ) {}

    ngOnInit(): void {
        this.tagsService.fetchTagsTrees(TagKind.Fandom).subscribe();
    }

    createTag() {
        this.dialog.open(TagFormComponent, {
            width: '100vw',
            height: '100vh',
            disableClose: true
        });
    }

    onOpen(id: string) {
        this.openPanelId = id;
    }

    addChild(parentId: string) {
        this.dialog.open(TagFormComponent, {
            data: { parentId: parentId },
            width: '100vw',
            height: '100vh',
            disableClose: true
        });
    }

    editTag(tag: TagsModel) {
        this.dialog.open(TagFormComponent, {
            data: { tag: tag },
            width: '100vw',
            height: '100vh',
            disableClose: true
        });
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

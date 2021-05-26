import { Component, OnInit } from '@angular/core';
import { TagsQuery, TagsService } from '@dragonfish/client/repository/dashboard/tags';
import { TagKind } from '@dragonfish/shared/models/content';
import { MatDialog } from '@angular/material/dialog';
import { TagFormComponent } from '../../components/tags-management';

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
}

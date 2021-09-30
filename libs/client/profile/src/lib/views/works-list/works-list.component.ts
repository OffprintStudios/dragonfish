import { Component, OnInit } from '@angular/core';
import { ContentKind } from '@dragonfish/shared/models/content';
import { WorkFormComponent, WorkFormData } from '@dragonfish/client/ui';
import { MatDialog } from '@angular/material/dialog';
import { ProfileQuery, ProfileService } from '../../repo';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ListPages } from '../../models';

@UntilDestroy()
@Component({
    selector: 'dragonfish-works-list',
    templateUrl: './works-list.component.html',
    styleUrls: ['./works-list.component.scss'],
})
export class WorksListComponent implements OnInit {
    kind = ContentKind;
    tabs = ListPages;
    selectedTab = ListPages.Published;

    constructor(private dialog: MatDialog, private profile: ProfileService, public profileQuery: ProfileQuery) {}

    ngOnInit(): void {
        this.profile.fetchWorksList().pipe(untilDestroyed(this)).subscribe();
    }

    changeTab(newTab: ListPages): void {
        this.selectedTab = newTab;
    }

    openForm(kind: ContentKind): void {
        const formData: WorkFormData = {
            kind: kind,
        };

        const ref = this.dialog.open(WorkFormComponent, { data: formData });
        ref.afterClosed().subscribe(() => {
            this.profile.refetchContent(ContentKind.ProseContent);
        });
    }
}

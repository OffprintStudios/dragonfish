import { Component, OnInit } from '@angular/core';
import { ContentKind } from '@dragonfish/shared/models/content';
import { SessionQuery } from '@dragonfish/client/repository/session';
import { Constants, setThreePartTitle } from '@dragonfish/shared/constants';
import { ProfileQuery } from '@dragonfish/client/repository/profile';
import { ListPages } from '../../models';
import { WorkFormComponent, WorkFormData } from '@dragonfish/client/ui';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '@dragonfish/client/repository/session/services';
import { UserWorksQuery } from '@dragonfish/client/repository/profile/user-works';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'dragonfish-profile-works',
    templateUrl: './works.component.html',
    styleUrls: ['./works.component.scss'],
})
export class WorksComponent implements OnInit {
    kind = ContentKind;
    tabs = ListPages;
    selectedTab = ListPages.Published;

    constructor(
        public sessionQuery: SessionQuery,
        public profileQuery: ProfileQuery,
        public userWorks: UserWorksQuery,
        public auth: AuthService,
        private dialog: MatDialog,
        private router: Router,
        private route: ActivatedRoute,
    ) {}

    ngOnInit(): void {
        setThreePartTitle(this.profileQuery.userTag, Constants.WORKS);
    }

    changeTab(newTab: ListPages): void {
        this.selectedTab = newTab;
    }

    openForm(kind: ContentKind): void {
        const formData: WorkFormData = {
            kind: kind,
        };

        this.dialog.open(WorkFormComponent, { data: formData });
    }

    onPageChange(event: number) {
        this.router.navigate([], {
            relativeTo: this.route,
            queryParams: { page: event },
            queryParamsHandling: 'merge',
        });
    }
}

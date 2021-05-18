import { Component, OnInit } from '@angular/core';
import { Work } from '@dragonfish/shared/models/works';
import { Blog } from '@dragonfish/shared/models/blogs';
import { ActivatedRoute } from '@angular/router';
import { MigrationModel } from './migration.model';
import { SessionQuery } from '@dragonfish/client/repository/session';
import { FrontendUser } from '@dragonfish/shared/models/users';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
    selector: 'dragonfish-migration',
    templateUrl: './migration.component.html',
    styleUrls: ['./migration.component.scss']
})
export class MigrationComponent implements OnInit {
    workView = true;
    currentUser: FrontendUser;
    myWorks: Work[];
    myBlogs: Blog[];

    columnsToDisplay = ['title', 'createdAt'];

    constructor(public route: ActivatedRoute, private sessionQuery: SessionQuery) {
        this.sessionQuery.currentUser$.pipe(untilDestroyed(this)).subscribe(x => {
            this.currentUser = x;
        });
    }

    ngOnInit(): void {
        const data = this.route.snapshot.data.contentData as MigrationModel;
        this.myWorks = data.works;
        this.myBlogs = data.blogs;
    }

    switchView() {
        this.workView = this.workView !== true;
    }
}

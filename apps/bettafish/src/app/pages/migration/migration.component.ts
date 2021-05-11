import { Component, OnInit } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';
import { UserState } from '@dragonfish/client/repository/user';
import { FrontendUser } from '@dragonfish/shared/models/users';
import { Work } from '@dragonfish/shared/models/works';
import { Blog } from '@dragonfish/shared/models/blogs';
import { ActivatedRoute } from '@angular/router';
import { MigrationModel } from './migration.model';

@Component({
    selector: 'dragonfish-migration',
    templateUrl: './migration.component.html',
    styleUrls: ['./migration.component.scss']
})
export class MigrationComponent implements OnInit {
    @Select(UserState.currUser) currentUser$: Observable<FrontendUser>;
    currentUserSubscription: Subscription;
    currentUser: FrontendUser;

    workView = true;

    myWorks: Work[];
    myBlogs: Blog[];

    columnsToDisplay = ['title', 'createdAt'];

    constructor(public route: ActivatedRoute) {
        this.currentUserSubscription = this.currentUser$.subscribe(x => {
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

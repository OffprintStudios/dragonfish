import { Component, OnInit } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';
import { UserState } from '../../shared/user';

import { FrontendUser } from '@dragonfish/models/users';
import { Work } from '@dragonfish/models/works';
import { Blog } from '@dragonfish/models/blogs';
import { ActivatedRoute } from '@angular/router';
import { MigrationModel } from './migration.model';

@Component({
    selector: 'migration',
    templateUrl: './migration.component.html',
    styleUrls: ['./migration.component.less']
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
        if (this.workView === true) {
            this.workView = false;
        } else {
            this.workView = true;
        }
    }
}
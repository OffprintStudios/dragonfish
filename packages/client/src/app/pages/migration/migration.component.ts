import { Component, OnInit } from '@angular/core';

import { FrontendUser } from '@pulp-fiction/models/users';
import { AuthService } from '../../services/auth';
import { Work } from '@pulp-fiction/models/works';
import { Blog } from '@pulp-fiction/models/blogs';
import { ActivatedRoute } from '@angular/router';
import { MigrationModel } from './migration.model';

@Component({
    selector: 'migration',
    templateUrl: './migration.component.html',
    styleUrls: ['./migration.component.less']
})
export class MigrationComponent implements OnInit {
    currentUser: FrontendUser;
    workView = true;

    myWorks: Work[];
    myBlogs: Blog[];

    columnsToDisplay = ['title', 'createdAt'];
    
    constructor(private authService: AuthService, private route: ActivatedRoute) {
        this.authService.currUser.subscribe(x => { this.currentUser = x; });
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
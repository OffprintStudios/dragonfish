import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Collection } from '@pulp-fiction/models/collections';
import { FrontendUser } from '@pulp-fiction/models/users';
import { AuthService } from 'packages/client/src/app/services/auth';

@Component({
    selector: 'collection-page',
    templateUrl: './collection-page.component.html',
    styleUrls: ['./collection-page.component.less']
})
export class CollectionPageComponent implements OnInit {
    currentUser: FrontendUser;
    portUser: FrontendUser;

    collData: Collection;

    constructor(private auth: AuthService, private route: ActivatedRoute) {
        this.auth.currUser.subscribe(x => {
            this.currentUser = x;
        });
    }

    ngOnInit(): void {
        this.portUser = this.route.parent.snapshot.data.portData as FrontendUser;
        this.route.data.subscribe(data => {
            console.log(data.collData);
            this.collData = data.collData as Collection;
        });
    }

    /**
     * Checks to see if the currently logged in user is the same as the one
     * that owns this portfolio.
     */
    currentUserIsSame() {
        return this.currentUser && this.portUser && this.currentUser._id === this.portUser._id;
    }
}
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ContentKind } from '@dragonfish/shared/models/content';
import { Constants, setTwoPartTitle } from '@dragonfish/shared/constants';
import { MyStuffQuery, MyStuffService } from '@dragonfish/client/repository/my-stuff';
import { FormControl, FormGroup } from '@angular/forms';
import { AlertsService } from '@dragonfish/client/alerts';
import { FrontendUser, Roles } from '@dragonfish/shared/models/users';
import { isAllowed } from '@dragonfish/shared/functions';
import { SessionQuery } from '@dragonfish/client/repository/session';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { FrontendAccount } from '@dragonfish/shared/models/accounts';

@UntilDestroy()
@Component({
    selector: 'dragonfish-my-stuff',
    templateUrl: './my-stuff.component.html',
    styleUrls: ['./my-stuff.component.scss'],
})
export class MyStuffComponent implements OnInit {
    isIconView = true;
    contentKind = ContentKind;
    filterMenuOpened = false;
    createMenuOpened = false;

    searchForm = new FormGroup({
        query: new FormControl(''),
    });

    constructor(
        public route: ActivatedRoute,
        public router: Router,
        public sessionQuery: SessionQuery,
        private myStuff: MyStuffService,
        public myStuffQuery: MyStuffQuery,
        private alerts: AlertsService,
    ) {}

    ngOnInit(): void {
        setTwoPartTitle(Constants.MY_STUFF);
        this.myStuff.setAll().pipe(untilDestroyed(this)).subscribe();
    }

    submitSearch() {
        this.alerts.info(`Search for My Stuff is not yet enabled!`);
    }

    toggleCreateMenu() {
        this.createMenuOpened = !this.createMenuOpened;
    }

    toggleFilterMenu() {
        this.filterMenuOpened = !this.filterMenuOpened;
    }

    /**
     * Navigates to a creation form based on the content kind. Clears any currently selected content
     * first.
     *
     * @param kind The kind requested
     */
    createContent(kind: ContentKind) {
        this.myStuff.setActive(null);
        switch (kind) {
            case ContentKind.BlogContent:
                this.router.navigate(['/my-stuff/new-blog']);
                break;
            case ContentKind.NewsContent:
                this.router.navigate(['/my-stuff/new-post']);
                break;
            case ContentKind.PoetryContent:
                this.router.navigate(['/my-stuff/new-poetry']);
                break;
            case ContentKind.ProseContent:
                this.router.navigate(['/my-stuff/new-prose']);
                break;
        }
    }

    /**
     * Checks to see if the currently signed in user is allowed to access the newspost form.
     * @param currentUser
     */
    checkIsAllowed(currentUser: FrontendAccount) {
        return isAllowed(currentUser.roles, [Roles.Contributor, Roles.Admin, Roles.Moderator]);
    }
}

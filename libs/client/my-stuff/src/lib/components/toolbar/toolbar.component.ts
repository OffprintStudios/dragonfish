import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { ContentKind, ContentModel, PubChange, PubStatus } from '@dragonfish/shared/models/content';
import { MyStuffState } from '../../repo';
import { FrontendUser, Roles } from '@dragonfish/shared/models/users';
import { AlertsService } from '@dragonfish/client/alerts';
import { MyStuffService } from '../../repo/services';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { Navigate } from '@ngxs/router-plugin';
import { isAllowed } from '@dragonfish/shared/functions';
import { SessionQuery } from '@dragonfish/client/repository/session';

@Component({
    selector: 'dragonfish-my-stuff-toolbar',
    templateUrl: './toolbar.component.html',
    styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent {
    @Select(MyStuffState.currContent) currContent$: Observable<ContentModel>;

    private currentUser: FrontendUser;
    contentKind = ContentKind;
    pubStatus = PubStatus;
    isIconView = true;

    constructor(
        public route: ActivatedRoute,
        private alerts: AlertsService,
        private router: Router,
        private stuff: MyStuffService,
        public sessionQuery: SessionQuery,
    ) {}

    /**
     * Sets the currently selected content to null.
     */
    deselect() {
        this.stuff.setCurrentContent(null);
    }

    /**
     * Sends a request to publish the specified content given its info.
     *
     * @param content The content to publish
     */
    publishOne(content: ContentModel) {
        const pubChange: PubChange = {
            oldStatus: content.audit.published,
            newStatus: content.audit.published === PubStatus.Unpublished ? PubStatus.Published : PubStatus.Unpublished,
        };

        if (content.kind === ContentKind.BlogContent || content.kind === ContentKind.NewsContent) {
            this.stuff.publishContent(content._id, pubChange);
        } else if (content.kind === ContentKind.PoetryContent || content.kind === ContentKind.ProseContent) {
            if (content.audit.published === PubStatus.Unpublished) {
                this.stuff.publishContent(content._id);
            } else {
                return;
            }
        }
    }

    /**
     * Navigates to the specified view page.
     *
     * @param content The content item to view
     */
    viewContent(content: ContentModel) {
        if (content.kind === ContentKind.BlogContent) {
            this.router.navigate(['view-blog'], { relativeTo: this.route });
        } else if (content.kind === ContentKind.NewsContent) {
            this.router.navigate(['view-post'], { relativeTo: this.route });
        } else if (content.kind === ContentKind.ProseContent) {
            this.router.navigate(['view-prose'], { relativeTo: this.route });
        } else if (content.kind === ContentKind.PoetryContent) {
            this.router.navigate(['view-poetry'], { relativeTo: this.route });
        }
    }

    /**
     * Navigates to a creation form based on the content kind. Clears any currently selected content
     * first.
     *
     * @param kind The kind requested
     */
    createContent(kind: ContentKind) {
        switch (kind) {
            case ContentKind.BlogContent:
                this.deselect();
                this.navigation(['/my-stuff/new-blog']);
                break;
            case ContentKind.NewsContent:
                this.deselect();
                this.navigation(['/my-stuff/new-post']);
                break;
            case ContentKind.PoetryContent:
                this.deselect();
                this.navigation(['/my-stuff/new-poetry']);
                break;
            case ContentKind.ProseContent:
                this.deselect();
                this.navigation(['/my-stuff/new-prose']);
                break;
        }
    }

    /**
     * Goes back to the My Stuff page.
     */
    goBack() {
        this.navigation(['/my-stuff']);
        this.deselect();
    }

    /**
     * Navigates to a specified route.
     *
     * @param url The requested URL
     */
    @Dispatch() navigation = (url: string[]) => new Navigate(url);

    /**
     * Checks to see if the currently signed in user is allowed to access the newspost form.
     * @param currentUser
     */
    checkIsAllowed(currentUser: FrontendUser) {
        return isAllowed(currentUser.roles, [Roles.Contributor, Roles.Admin, Roles.Moderator]);
    }
}

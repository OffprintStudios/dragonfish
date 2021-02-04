import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Clipboard } from '@angular/cdk/clipboard';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Select } from '@ngxs/store';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { Observable } from 'rxjs';
import { slugify } from 'voca';
import { MyStuff, MyStuffState } from '../../shared/my-stuff';
import { UserState } from '../../shared/user';
import { Constants, Title } from '../../shared';

import { ContentModel, ContentKind, PubStatus, PubChange } from '@dragonfish/models/content';
import { AlertsService } from '../../shared/alerts';
import { FrontendUser, Roles, UserInfo } from '@dragonfish/models/users';
import { Navigate } from '@ngxs/router-plugin';
import { isAllowed } from '../../util/functions';
import { MyStuffService } from './my-stuff.service';

@UntilDestroy()
@Component({
    selector: 'my-stuff',
    templateUrl: './my-stuff.component.html',
    styleUrls: ['./my-stuff.component.less'],
})
export class MyStuffComponent implements OnInit {
    @Select(UserState.currUser) private currUser$: Observable<FrontendUser>;
    private currentUser: FrontendUser;

    @Select(MyStuffState.myStuff) myStuff$: Observable<ContentModel[]>;
    @Select(MyStuffState.currContent) currContent$: Observable<ContentModel>;
    contentKind = ContentKind;
    pubStatus = PubStatus;
    isIconView = true;

    searchStuff = new FormGroup({
        query: new FormControl(''),
    });

    constructor(
        public route: ActivatedRoute,
        private clipboard: Clipboard,
        private alerts: AlertsService,
        private router: Router,
        private stuffService: MyStuffService,
    ) {
        this.currUser$.pipe(untilDestroyed(this)).subscribe((x) => {
            this.currentUser = x;
        });
    }

    ngOnInit(): void {
        Title.setTwoPartTitle(Constants.MY_STUFF);
    }

    /**
     * Sets the currently selected content to null.
     */
    @Dispatch() deselect = () => new MyStuff.SetCurrentContent(null);

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
            this.stuffService.publishContent(content._id, pubChange);
        } else if (content.kind === ContentKind.PoetryContent || content.kind === ContentKind.ProseContent) {
            if (content.audit.published === PubStatus.Unpublished) {
                this.stuffService.publishContent(content._id);
            } else {
                return;
            }
        }
    }

    /**
     * Asks if a user really wants to delete the specified content. If yes,
     * sends a request to delete the specified content given its ID. If no,
     * does nothing.
     *
     * @param contentId The content ID
     */
    deleteContent(contentId: string) {
        if (confirm(`Are you sure you want to delete this? This action is irreversible.`)) {
            this.stuffService.deleteContent(contentId);
        } else {
            return;
        }
    }

    /**
     * Generates a share link for the specified content. If the content is not `Published`, then
     * a warning will appear.
     *
     * @param content The specific piece of content
     */
    getShareLink(content: ContentModel) {
        if (content.audit.published !== PubStatus.Published) {
            this.alerts.warn(`Links can only be generated for published content.`);
            return;
        }

        const authorInfo = content.author as UserInfo;

        if (content.kind === ContentKind.BlogContent) {
            this.clipboard.copy(
                `https://offprint.net/portfolio/${authorInfo._id}/${slugify(authorInfo.username)}/blog/${slugify(
                    content.title,
                )}`,
            );
        } else if (content.kind === ContentKind.ProseContent) {
            this.clipboard.copy(`https://offprint.net/prose/${content._id}/${slugify(content.title)}`);
        } else if (content.kind === ContentKind.PoetryContent) {
            this.clipboard.copy(`https://offprint.net/poetry/${content._id}/${slugify(content.title)}`);
        } else {
            this.alerts.error(`Content Kind does not exist.`);
            return;
        }

        this.alerts.success(`Copied link!`);
        return;
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
     */
    checkIsAllowed() {
        return isAllowed(this.currentUser.roles, [Roles.Contributor, Roles.Admin, Roles.Moderator]);
    }
}

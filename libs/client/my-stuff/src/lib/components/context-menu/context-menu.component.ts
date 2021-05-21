import { Component } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ContextMenuService, MenuComponent, MenuPackage } from '@ctrl/ngx-rightclick';
import { ContentKind, ContentModel, PubChange, PubStatus } from '@dragonfish/shared/models/content';
import { UserInfo } from '@dragonfish/shared/models/users';
import { slugify } from 'voca';
import { MyStuffService } from '@dragonfish/client/repository/my-stuff';
import { Clipboard } from '@angular/cdk/clipboard';
import { AlertsService } from '@dragonfish/client/alerts';
import { PopupModel } from '@dragonfish/shared/models/util';
import { PopupComponent } from '@dragonfish/client/ui';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
    selector: 'dragonfish-context-menu',
    templateUrl: './context-menu.component.html',
    animations: [
        trigger('menu', [
            state(
                'enter',
                style({ opacity: 1, marginTop: '0px', visibility: 'visible' }),
            ),
            state('exit, void', style({ opacity: 0, marginTop: '-15px' })),
            transition('* => *', animate('120ms ease-in')),
        ]),
    ],
})
export class ContextMenuComponent extends MenuComponent {
    content: ContentModel;
    pubStatus = PubStatus;
    // this module does not have animations, set lazy false
    lazy = false;

    constructor(
        public menuPackage: MenuPackage,
        public contextMenuService: ContextMenuService,
        private stuff: MyStuffService,
        private clipboard: Clipboard,
        private alerts: AlertsService,
        private dialog: MatDialog,
        private router: Router,
    ) {
        super(menuPackage, contextMenuService);
        // grab any required menu context passed via menuContext input
        this.content = menuPackage.context;
        this.stuff.setActive(this.content._id);
    }

    /**
     * Publishes a piece of content.
     */
    publish() {
        const pubChange: PubChange = {
            oldStatus: this.content.audit.published,
            newStatus: this.content.audit.published === PubStatus.Unpublished ? PubStatus.Published : PubStatus.Unpublished,
        };

        if (this.content.kind === ContentKind.BlogContent || this.content.kind === ContentKind.NewsContent) {
            this.stuff.publish(this.content._id, pubChange);
        } else if (this.content.kind === ContentKind.PoetryContent || this.content.kind === ContentKind.ProseContent) {
            switch (this.content.audit.published) {
                case PubStatus.Published:
                    this.alerts.error(`Un-publishing is not yet supported for the selected content type.`);
                    return;
                case PubStatus.Unpublished:
                    this.stuff.publish(this.content._id).subscribe();
                    break;
                case PubStatus.Pending:
                    this.alerts.error(`You've already submitted this to the queue.`);
                    return;
                case PubStatus.Rejected:
                    this.alerts.error(`Your fic wasn't accepted. Contact a moderator for more info.`);
                    return;
                case PubStatus.ApprovedUnpublished:
                    this.alerts.error(`Switching back to a published fic is not yet supported.`);
                    return;
            }
        }
    }

    /**
     * Asks if a user really wants to delete the specified content. If yes,
     * sends a request to delete the specified content given its ID. If no,
     * does nothing.
     */
    deleteContent() {
        const alertData: PopupModel = {
            message: 'Are you sure you want to delete this? This action is irreversible.',
            confirm: true,
        };
        const dialogRef = this.dialog.open(PopupComponent, { data: alertData });
        dialogRef.afterClosed().subscribe((wantsToDelete: boolean) => {
            if (wantsToDelete) {
                this.stuff.delete(this.content._id);
            }
            this.contextMenuService.closeAll();
        });
    }

    /**
     * Generates a share link for the specified content. If the content is not `Published`, then
     * a warning will appear.
     */
    getShareLink() {
        if (this.content.audit.published !== PubStatus.Published) {
            this.alerts.warn(`Links can only be generated for published content.`);
            return;
        }

        const authorInfo = this.content.author as UserInfo;

        if (this.content.kind === ContentKind.BlogContent) {
            this.clipboard.copy(
                `https://offprint.net/portfolio/${authorInfo._id}/${slugify(authorInfo.username)}/blog/${slugify(
                    this.content.title,
                )}`,
            );
        } else if (this.content.kind === ContentKind.ProseContent) {
            this.clipboard.copy(`https://offprint.net/prose/${this.content._id}/${slugify(this.content.title)}`);
        } else if (this.content.kind === ContentKind.PoetryContent) {
            this.clipboard.copy(`https://offprint.net/poetry/${this.content._id}/${slugify(this.content.title)}`);
        } else {
            this.alerts.error(`Content Kind does not exist.`);
            return;
        }

        this.alerts.success(`Copied link!`);
        this.contextMenuService.closeAll();
        return;
    }

    /**
     * Navigates to the specified view page.
     */
    viewContent() {
        if (this.content.kind === ContentKind.BlogContent) {
            this.router.navigate(['/my-stuff/view-blog']);
        } else if (this.content.kind === ContentKind.NewsContent) {
            this.router.navigate(['/my-stuff/view-post']);
        } else if (this.content.kind === ContentKind.ProseContent) {
            this.router.navigate(['/my-stuff/view-prose']);
        } else if (this.content.kind === ContentKind.PoetryContent) {
            this.router.navigate(['/my-stuff/view-poetry']);
        }
        this.contextMenuService.closeAll();
    }
}

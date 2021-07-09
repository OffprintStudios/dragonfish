import { Component } from '@angular/core';
import { MyStuffQuery, MyStuffService } from '@dragonfish/client/repository/my-stuff';
import { ContentKind, ContentModel } from '@dragonfish/shared/models/content';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'dragonfish-content-page',
    templateUrl: './content-page.component.html',
    styleUrls: ['./content-page.component.scss'],
})
export class ContentPageComponent {
    constructor(
        private myStuff: MyStuffService,
        public myStuffQuery: MyStuffQuery,
        private route: ActivatedRoute,
        private router: Router
    ) {}

    /**
     * Deselects the currently active content;
     */
    deselect() {
        this.myStuff.setActive(null);
    }

    /**
     * Navigates to the specified view page.
     *
     * @param content The content item to view
     */
    viewContent(content: ContentModel) {
        if (content.kind === ContentKind.BlogContent) {
            this.router.navigate(['view-blog'], { relativeTo: this.route }).catch(err => console.log(err));
        } else if (content.kind === ContentKind.NewsContent) {
            this.router.navigate(['view-post'], { relativeTo: this.route }).catch(err => console.log(err));
        } else if (content.kind === ContentKind.ProseContent) {
            this.router.navigate(['view-prose'], { relativeTo: this.route }).catch(err => console.log(err));
        } else if (content.kind === ContentKind.PoetryContent) {
            this.router.navigate(['view-poetry'], { relativeTo: this.route }).catch(err => console.log(err));
        }
    }
}

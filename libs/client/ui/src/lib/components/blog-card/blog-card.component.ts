import { Component, Input } from '@angular/core';
import { ContentKind } from '@dragonfish/shared/models/content';

@Component({
    selector: 'dragonfish-blog-card',
    templateUrl: './blog-card.component.html',
    styleUrls: ['./blog-card.component.scss'],
})
export class BlogCardComponent {
    @Input() blog: any;
    @Input() showAuthor: boolean;

    contentKind = ContentKind;
}

import { Component, Input } from '@angular/core';
import { NewsCategory } from '@dragonfish/shared/models/content';

@Component({
    selector: 'dragonfish-news-card',
    templateUrl: './news-card.component.html',
    styleUrls: ['./news-card.component.scss'],
})
export class NewsCardComponent {
    @Input() post: any;

    categories = NewsCategory;
}

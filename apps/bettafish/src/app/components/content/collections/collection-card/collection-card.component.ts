import { Component, Input } from '@angular/core';
import { Collection } from '@dragonfish/shared/models/collections';

@Component({
    selector: 'dragonfish-collection-card',
    templateUrl: './collection-card.component.html',
    styleUrls: ['./collection-card.component.scss']
})
export class CollectionCardComponent {
    @Input() collection: Collection;
}

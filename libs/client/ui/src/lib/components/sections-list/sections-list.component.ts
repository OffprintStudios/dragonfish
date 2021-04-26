import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Section } from '@dragonfish/shared/models/sections';

@Component({
    selector: 'dragonfish-sections-list',
    templateUrl: './sections-list.component.html',
    styleUrls: ['./sections-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionsListComponent implements OnChanges {
    @Input() sections: Section[];
    @Input() contentBox = false;

    ngOnChanges(changes: SimpleChanges) {
        const value = changes['sections'];
        if (value.previousValue !== undefined) {
            this.sections = value.currentValue;
        }
    }
}

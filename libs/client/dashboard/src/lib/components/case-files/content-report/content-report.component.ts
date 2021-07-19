import { Component, Input } from '@angular/core';
import { ContentKind, ContentModel } from '@dragonfish/shared/models/content';

@Component({
    selector: 'dragonfish-content-report',
    templateUrl: './content-report.component.html',
})
export class ContentReportComponent {
    @Input() content: any;

    contentKind = ContentKind;
}

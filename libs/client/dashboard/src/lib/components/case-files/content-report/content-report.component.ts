import { Component, Input } from '@angular/core';
import { ContentKind } from '@dragonfish/shared/models/content';

@Component({
    selector: 'dragonfish-content-report',
    templateUrl: './content-report.component.html',
    styleUrls: ['./content-report.component.scss'],
})
export class ContentReportComponent {
    @Input() content: any;

    contentKind = ContentKind;
}

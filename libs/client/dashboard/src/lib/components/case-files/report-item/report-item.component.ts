import { Component, Input } from '@angular/core';
import { Report, ReportReason } from '@dragonfish/shared/models/case-files';

@Component({
    selector: 'dragonfish-report-item',
    templateUrl: './report-item.component.html',
})
export class ReportItemComponent {
    @Input() reports: Report[];
    reasons = ReportReason;
}

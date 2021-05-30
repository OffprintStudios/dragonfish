import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CaseKind, ReportForm, ReportReason } from '@dragonfish/shared/models/case-files';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DragonfishNetworkService } from '@dragonfish/client/services';
import { AlertsService } from '@dragonfish/client/alerts';

@Component({
    selector: 'dragonfish-report-dialog',
    templateUrl: './report-dialog.component.html',
})
export class ReportDialogComponent {
    reasons = ReportReason;
    caseKind = CaseKind;

    reportForm = new FormGroup({
        reasons: new FormControl([], Validators.required),
        body: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]),
    });

    constructor(
        private dialogRef: MatDialogRef<ReportDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { kind: CaseKind; itemId: string },
        private network: DragonfishNetworkService,
        private alerts: AlertsService,
    ) {}

    cancel() {
        this.dialogRef.close();
    }

    submitForm() {
        if (this.reportForm.controls.reasons.value.length < 1) {
            this.alerts.error(`You must include at least one reason.`);
            return;
        }

        if (this.reportForm.controls.body.invalid) {
            this.alerts.error(`Your description must be between 5 and 100 characters.`);
            return;
        }

        const formData: ReportForm = {
            reasons: this.reportForm.controls.reasons.value,
            body: this.reportForm.controls.body.value,
        };

        this.network.submitReport(this.data.itemId, this.data.kind, formData).subscribe(() => {
            this.alerts.success(`Thank you for reporting!`);
            this.dialogRef.close();
        });
    }
}

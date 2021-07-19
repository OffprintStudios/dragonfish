import { Component } from '@angular/core';
import { CaseFilesQuery, CaseFilesService } from '@dragonfish/client/repository/dashboard/case-files';
import { CaseKind, NoteForm } from '@dragonfish/shared/models/case-files';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertsService } from '@dragonfish/client/alerts';

@Component({
    selector: 'dragonfish-view-file',
    templateUrl: './view-file.component.html',
})
export class ViewFileComponent {
    caseKind = CaseKind;

    noteForm = new FormGroup({
        body: new FormControl('', [Validators.required]),
    });

    constructor(
        public fileQuery: CaseFilesQuery,
        private fileService: CaseFilesService,
        private alerts: AlertsService,
    ) {}

    submitNote(id: number) {
        if (this.noteForm.invalid) {
            this.alerts.error(`You must actually type something.`);
            return;
        }

        const note: NoteForm = {
            body: this.noteForm.controls.body.value,
        };

        this.fileService.addNote(id, note).subscribe();
    }
}

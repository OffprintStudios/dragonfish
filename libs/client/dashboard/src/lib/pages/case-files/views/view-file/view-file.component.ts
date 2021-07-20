import { Component, ViewEncapsulation, ViewChild, AfterViewInit } from '@angular/core';
import { CaseFilesQuery, CaseFilesService } from '@dragonfish/client/repository/dashboard/case-files';
import { CaseKind, NoteForm } from '@dragonfish/shared/models/case-files';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertsService } from '@dragonfish/client/alerts';
import { NgScrollbar } from 'ngx-scrollbar';

@Component({
    selector: 'dragonfish-view-file',
    templateUrl: './view-file.component.html',
    styleUrls: ['./view-file.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class ViewFileComponent implements AfterViewInit {
    @ViewChild('notesBoxScrollbar') notesBoxScrollbar: NgScrollbar;

    caseKind = CaseKind;

    noteForm = new FormGroup({
        body: new FormControl('', [Validators.required]),
    });

    constructor(
        public fileQuery: CaseFilesQuery,
        private fileService: CaseFilesService,
        private alerts: AlertsService,
    ) {}

    ngAfterViewInit(): void {
        this.notesBoxScrollbar.scrollTo({ bottom: 0 }).catch((err) => console.log(err));
    }

    submitNote(id: number) {
        if (this.noteForm.invalid) {
            this.alerts.error(`You must actually type something.`);
            return;
        }

        const note: NoteForm = {
            body: this.noteForm.controls.body.value,
        };

        this.fileService.addNote(id, note).subscribe(() => {
            this.notesBoxScrollbar
                .scrollTo({ bottom: 0 })
                .then(() => {
                    this.noteForm.reset();
                })
                .catch((err) => console.log(err));
        });
    }
}

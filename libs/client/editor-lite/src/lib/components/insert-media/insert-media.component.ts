import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AlertsService } from '@dragonfish/client/alerts';

@Component({
    selector: 'dragonfish-insert-media',
    templateUrl: './insert-media.component.html',
})
export class InsertMediaComponent implements OnInit {
    title = `Insert Media`;
    altTextLabel = `Alt Text`;
    linkLabel = `Image Link`;

    insertMedia = new FormGroup({
        link: new FormControl('', [Validators.required]),
    });

    constructor(
        private dialogRef: MatDialogRef<InsertMediaComponent>,
        private alerts: AlertsService,
        @Inject(MAT_DIALOG_DATA) public data: { title: string },
    ) {}

    ngOnInit() {
        this.title = this.data.title;
        if (this.title === 'Insert Image') {
            this.altTextLabel = `Alt Text`;
            this.linkLabel = `Image Link`;
        } else {
            this.altTextLabel = `Title`;
            this.linkLabel = `Media Link`;
        }
    }

    cancel() {
        this.dialogRef.close();
    }

    submit() {
        if (this.insertMedia.invalid) {
            this.alerts.error(`Both fields are required!`);
            return;
        }

        if (this.data.title === `Insert Image`) {
            this.dialogRef.close(this.insertMedia.controls.link.value);
        } else {
            const link = `https://www.youtube.com/embed/${this.parseMediaLink(this.insertMedia.controls.link.value)}`;
            this.dialogRef.close(
                `<iframe width="560" height="315" src="${link}" frameborder="0" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`,
            );
        }
    }

    private parseMediaLink(url: string) {
        const arr = url.split(/(vi\/|v%3D|v=|\/v\/|youtu\.be\/|\/embed\/)/);
        return undefined !== arr[2] ? arr[2].split(/[^\w-]/i)[0] : arr[0];
    }
}

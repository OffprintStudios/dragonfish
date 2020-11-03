import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Location } from '@angular/common';

import { WorkKind, Genres, ContentRating, WorkStatus, CreateProse } from '@pulp-fiction/models/content';
import { ProseService } from 'packages/client/src/app/services/user';

@Component({
    selector: 'prose-form',
    templateUrl: './prose-form.component.html',
    styleUrls: ['./prose-form.component.less']
})
export class ProseFormComponent implements OnInit {
    formTitle = `Create New Prose`;

    categories = WorkKind;
    genres = Genres;
    ratings = ContentRating;
    statuses = WorkStatus;

    proseForm = new FormGroup({
        title: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]),
        desc: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]),
        body: new FormControl('', [Validators.required, Validators.minLength(3)]),
        category: new FormControl(null, [Validators.required]),
        genres: new FormControl([], [Validators.required, Validators.minLength(1), Validators.maxLength(3)]),
        rating: new FormControl(null, [Validators.required]),
        status: new FormControl(null, [Validators.required])
    });

    constructor(private proseService: ProseService, private snackBar: MatSnackBar, private location: Location) {}

    ngOnInit(): void {}

    get fields() { return this.proseForm.controls; }

    submitForm() {
        if (this.proseForm.invalid) {
            this.snackBar.open(`Looks like something's wrong with the stuff you've entered.`);
            return;
        }

        const proseInfo: CreateProse ={
            title: this.fields.title.value,
            desc: this.fields.desc.value,
            body: this.fields.body.value,
            category: this.fields.category.value,
            genres: this.fields.genres.value,
            rating: this.fields.rating.value,
            status: this.fields.status.value
        };

        this.proseService.createProse(proseInfo).subscribe(() => {
            this.location.back();
        });
    }
}
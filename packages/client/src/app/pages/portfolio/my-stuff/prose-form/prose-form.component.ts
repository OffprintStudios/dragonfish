import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

import { WorkKind, Genres, ContentRating, WorkStatus } from '@pulp-fiction/models/content';

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
        title: new FormControl(''),
        desc: new FormControl(''),
        body: new FormControl(''),
        category: new FormControl(null),
        genres: new FormControl([]),
        rating: new FormControl(null),
        status: new FormControl(null)
    });

    constructor() {}

    ngOnInit(): void {}

    get fields() { return this.proseForm.controls; }
}
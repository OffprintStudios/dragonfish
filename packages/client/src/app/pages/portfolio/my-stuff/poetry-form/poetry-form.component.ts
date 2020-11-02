import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { WorkKind, PoetryForm, Genres, ContentRating, WorkStatus } from '@pulp-fiction/models/content';

@Component({
  selector: 'poetry-form',
  templateUrl: './poetry-form.component.html',
  styleUrls: ['./poetry-form.component.less']
})
export class PoetryFormComponent implements OnInit {
    formTitle = `Create New Poetry`;

    categories = WorkKind;
    forms = PoetryForm;
    genres = Genres;
    ratings = ContentRating;
    statuses = WorkStatus;

    poetryForm = new FormGroup({
        title: new FormControl(''),
        desc: new FormControl(''),
        body: new FormControl(''),
        category: new FormControl(null),
        form: new FormControl(null),
        genres: new FormControl([]),
        rating: new FormControl(null),
        status: new FormControl(null)
    });

    constructor() {}

    ngOnInit(): void {}

    get fields() { return this.poetryForm.controls; }
}

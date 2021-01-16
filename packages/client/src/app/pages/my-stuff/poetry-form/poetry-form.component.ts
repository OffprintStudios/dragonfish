import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';

import { WorkKind, CreatePoetry, PoetryForm, Genres, 
  ContentRating, WorkStatus, PoetryContent } from '@pulp-fiction/models/content';
import { PoetryService } from '../../../services/user';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'poetry-form',
  templateUrl: './poetry-form.component.html',
  styleUrls: ['./poetry-form.component.less']
})
export class PoetryFormComponent implements OnInit {
    formTitle = `Create New Poetry`;
    currPoetry: PoetryContent;
    editMode = false;

    categories = WorkKind;
    forms = PoetryForm;
    genres = Genres;
    ratings = ContentRating;
    statuses = WorkStatus;
    isCollection = false;

    poetryForm = new FormGroup({
        title: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]),
        desc: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(250)]),
        body: new FormControl('', [Validators.required, Validators.minLength(3)]),
        category: new FormControl(null, [Validators.required]),
        form: new FormControl(null, [Validators.required]),
        genres: new FormControl([], [Validators.required, Validators.minLength(1), Validators.maxLength(3)]),
        rating: new FormControl(null, [Validators.required]),
        status: new FormControl(null, [Validators.required])
    });

    constructor(private poetryService: PoetryService, private snackBar: MatSnackBar, private location: Location,
      private route: ActivatedRoute) {}

    ngOnInit(): void {
      const data = this.route.snapshot.data.contentData as PoetryContent;
      if (data) {
        this.currPoetry = data;
        this.editMode = true;
        this.formTitle = `Editing "${this.currPoetry.title}"`
        this.isCollection = this.currPoetry.meta.collection;
        this.poetryForm.setValue({
          title: this.currPoetry.title,
          desc: this.currPoetry.desc,
          body: this.currPoetry.body,
          category: this.currPoetry.meta.category,
          form: this.currPoetry.meta.form,
          genres: this.currPoetry.meta.genres,
          rating: this.currPoetry.meta.rating,
          status: this.currPoetry.meta.status
        });
      }
    }

    get fields() { return this.poetryForm.controls; }

    goBack() {
        if (this.poetryForm.dirty && this.poetryForm.touched) {
          if (confirm(`Are you sure you want to go back? Any unsaved changes will be lost.`)) {
            this.location.back();
          } else {
            return;
          }
        } else {
          this.location.back();
        }
      }

    submitForm() {
      if (this.poetryForm.invalid) {
          this.snackBar.open(`Looks like something's wrong with the stuff you've entered.`);
          return;
      }

      const poetryInfo: CreatePoetry ={
          title: this.fields.title.value,
          desc: this.fields.desc.value,
          body: this.fields.body.value,
          category: this.fields.category.value,
          collection: this.isCollection,
          form: this.fields.form.value,
          genres: this.fields.genres.value,
          rating: this.fields.rating.value,
          status: this.fields.status.value
      };

      if (this.editMode === false) {
        this.poetryService.createPoetry(poetryInfo).subscribe(() => {
          this.location.back();
        });
      } else {
        this.poetryService.editPoetry(this.currPoetry._id, poetryInfo).subscribe(poetry => {
          this.snackBar.open(`Changes saved successfully!`);
          this.location.back();
        })
      }
  }
}

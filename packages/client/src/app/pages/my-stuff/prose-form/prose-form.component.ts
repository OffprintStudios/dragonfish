import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { WorkKind, Genres, ContentRating, WorkStatus, CreateProse, ProseContent } from '@pulp-fiction/models/content';
import { ProseService } from '../../../services/user';

@Component({
    selector: 'prose-form',
    templateUrl: './prose-form.component.html',
    styleUrls: ['./prose-form.component.less']
})
export class ProseFormComponent implements OnInit {
    formTitle = `Create New Prose`;
    currProse: ProseContent;
    editMode = false;

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

    constructor(private route: ActivatedRoute, private proseService: ProseService, private snackBar: MatSnackBar, private location: Location) {}

    ngOnInit(): void {
      const data = this.route.snapshot.data.proseData as ProseContent;
      if (data) {
        this.currProse = data;
        this.editMode = true;
        this.formTitle = `Editing "${this.currProse.title}"`
        this.proseForm.setValue({
          title: this.currProse.title,
          desc: this.currProse.desc,
          body: this.currProse.body,
          category: this.currProse.meta.category,
          genres: this.currProse.meta.genres,
          rating: this.currProse.meta.rating,
          status: this.currProse.meta.status
        });
      }
    }

    get fields() { return this.proseForm.controls; }

    goBack() {
        if (this.proseForm.dirty && this.proseForm.touched) {
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

        if (this.editMode === false) {
          this.proseService.createProse(proseInfo).subscribe(() => {
            this.location.back();
          });
        } else {
          this.proseService.editProse(this.currProse._id, proseInfo).subscribe(prose => {
            this.currProse = prose;
            this.proseForm.setValue({
              title: this.currProse.title,
              desc: this.currProse.desc,
              body: this.currProse.body,
              category: this.currProse.meta.category,
              genres: this.currProse.meta.genres,
              rating: this.currProse.meta.rating,
              status: this.currProse.meta.status
            });
          });
        }
    }
}
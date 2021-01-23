import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { ContentRating, NewsCategory, NewsContentModel, NewsForm } from '@dragonfish/models/content';
import { NetworkService } from '../../../../services';

@Component({
    selector: 'post-form',
    templateUrl: './post-form.component.html',
    styleUrls: ['./post-form.component.less'],
})
export class PostFormComponent implements OnInit {
    categories = NewsCategory;

    currPost: NewsContentModel;
    pageTitle: string = `Create a Newspost`;
    editMode = false;
    createPostMode = true;
    ratings = ContentRating;

    postForm = new FormGroup({
        title: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(36)]),
        desc: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]),
        body: new FormControl('', [Validators.required, Validators.minLength(3)]),
        category: new FormControl(null, [Validators.required]),
    });

    constructor(
        private networkService: NetworkService,
        private snackBar: MatSnackBar,
        private route: ActivatedRoute,
        private location: Location,
    ) {}

    ngOnInit(): void {
        const post = this.route.snapshot.data.postData as NewsContentModel;

        console.log(post);

        if (post !== null && post !== undefined) {
            this.pageTitle = `Editing Newspost`;
            this.currPost = post;
            this.createPostMode = false;
            this.postForm.setValue({
                title: this.currPost.title,
                desc: this.currPost.desc,
                body: this.currPost.body,
                category: this.currPost.meta.category,
            });
        }
    }

    get formFields() {
        return this.postForm.controls;
    }

    switchView() {
        if (this.editMode === true) {
            this.editMode = false;
        } else {
            this.editMode = true;
        }
    }

    submitForm() {
        if (this.formFields.title.invalid) {
            this.snackBar.open(`Title must be between 3 and 36 characters.`);
            return;
        }

        if (this.formFields.desc.invalid) {
            this.snackBar.open(`Description must be between 3 and 50 characters.`);
            return;
        }

        if (this.formFields.body.invalid) {
            this.snackBar.open(`Post body cannot be empty.`);
            return;
        }

        if (this.formFields.category.invalid) {
            this.snackBar.open(`You must choose a category.`);
            return;
        }

        const formData: NewsForm = {
            title: this.formFields.title.value,
            desc: this.formFields.desc.value,
            body: this.formFields.body.value,
            category: this.formFields.category.value,
        };

        if (this.editMode) {
            if (this.currPost) {
                this.networkService.editNewspost(this.currPost._id, formData).subscribe(() => {
                    this.snackBar.open(`Changes saved!`);
                    this.location.back();
                });
            } else {
                this.snackBar.open(`Something went wrong!`);
                return;
            }
        } else {
            this.networkService.createNewspost(formData).subscribe(() => {
                this.snackBar.open(`Post saved successfully!`);
                this.location.back();
            });
        }
    }
}

import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';

import { NewsForm, NewsCategory, NewsContentModel } from '@pulp-fiction/models/content';
import { NewsService } from '../../../services/contrib/news';

@Component({
  selector: 'post-form',
  templateUrl: './post-form.component.html',
  styleUrls: ['./post-form.component.less']
})
export class PostFormComponent implements OnInit {
  categories = NewsCategory;

  currPost: NewsContentModel;
  pageTitle: string = `Create a Newspost`;
  isEditing: boolean = false;

  postForm = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(36)]),
    desc: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]),
    body: new FormControl('', [Validators.required, Validators.minLength(3)]),
    category: new FormControl(null, [Validators.required])
  });

  constructor(private newsService: NewsService, private snackBar: MatSnackBar, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.currPost = this.route.snapshot.data.post as NewsContentModel;
    if (this.currPost) {
      this.pageTitle = `Editing Newspost`;
      this.isEditing = true;
      console.log(this.currPost._id);
      this.postForm.setValue({
        title: this.currPost.title,
        desc: this.currPost.desc,
        body: this.currPost.body,
        category: this.currPost.meta.category
      });
    }
  }

  get formFields() { return this.postForm.controls; }

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
      category: this.formFields.category.value
    };

    if (this.isEditing) {
      if (this.currPost) {
        this.newsService.editNewspost(this.currPost._id, formData).subscribe(() => {
          this.snackBar.open(`Changes saved!`);
          this.router.navigate(['/news']);
        });
      } else {
        this.snackBar.open(`Something went wrong!`);
        return;
      }
    } else {
      this.newsService.createNewspost(formData).subscribe(() => {
        this.snackBar.open(`Post saved successfully!`);
        this.router.navigate(['/news']);
      });
    }
  }
}

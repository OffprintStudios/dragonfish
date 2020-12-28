import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { Blog } from '@pulp-fiction/models/blogs';
import { ContentKind, ContentRating, PubStatus } from '@pulp-fiction/models/content';
import { getQuillHtml } from 'packages/client/src/app/util/functions';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MigrationForm } from '@pulp-fiction/models/migration';
import { AuthService } from '../../../services/auth';
import { FrontendUser } from '@pulp-fiction/models/users';
import { throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Component({
    selector: 'migrate-blog',
    templateUrl: './migrate-blog.component.html',
    styleUrls: ['./migrate-blog.component.less']
})
export class MigrateBlogComponent implements OnInit {
    currentUser: FrontendUser;

    myBlog: Blog;
    ratings = ContentRating;

    migrateBlogForm = new FormGroup({
        title: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]),
        body: new FormControl('', [Validators.required, Validators.minLength(3)]),
        rating: new FormControl(null, [Validators.required])
    });

    constructor(private http: HttpClient, private route: ActivatedRoute, private snackBar: MatSnackBar, private auth: AuthService, private router: Router) {
        this.auth.currUser.subscribe(x => { this.currentUser = x; });
    }

    ngOnInit(): void {
        this.myBlog = this.route.snapshot.data.blogData as Blog;
        this.migrateBlogForm.setValue({
            title: this.myBlog.title,
            body: this.myBlog.body,
            rating: ContentRating.Everyone
        });
    }

    get fields() { return this.migrateBlogForm.controls; }

    migrateBlog() {
        if (this.migrateBlogForm.invalid) {
            this.snackBar.open(`Something's not right with the data you entered.`)
            return;
        }

        const bodyValue = this.myBlog.usesNewEditor 
            ? this.fields.body.value
            : getQuillHtml(document.querySelector("quill-editor"));

        const contentBlog: MigrationForm = {
            _id: this.myBlog._id,
            title: this.fields.title.value,
            author: this.currentUser._id,
            body: bodyValue,
            meta: {
                rating: this.fields.rating.value
            },
            stats: {
                words: this.myBlog.stats.words,
                views: this.myBlog.stats.views,
                likes: this.myBlog.stats.likes,
                dislikes: this.myBlog.stats.dislikes,
                comments: this.myBlog.stats.comments
            },
            published: this.myBlog.published ? PubStatus.Published : PubStatus.Unpublished,
            publishedOn: new Date(),
            kind: ContentKind.BlogContent,
            createdAt: this.myBlog.createdAt,
            updatedAt: this.myBlog.updatedAt
        };

        this.saveMigration(contentBlog).subscribe(() => {
            this.router.navigate(['/migration']);
        });
    }

    private saveMigration(formData: MigrationForm) {
        return this.http.put<void>(`/api/migration/save-migration`, formData, {observe: 'response', withCredentials: true})
            .pipe(map(res => {
                return res.body;
            }), catchError(err => {
                this.snackBar.open(`Something went wrong with this blog's migration!`);
                return throwError(err);
            }));
    }
}
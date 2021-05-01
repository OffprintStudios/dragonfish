import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Select } from '@ngxs/store';
import { Observable, Subscription, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { UserState } from '../../../repo/user';

import { Blog } from '@dragonfish/shared/models/blogs';
import { ContentKind, ContentRating, PubStatus } from '@dragonfish/shared/models/content';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MigrationForm } from '@dragonfish/shared/models/migration';
import { FrontendUser } from '@dragonfish/shared/models/users';

@Component({
    selector: 'dragonfish-migrate-blog',
    templateUrl: './migrate-blog.component.html',
    styleUrls: ['./migrate-blog.component.scss']
})
export class MigrateBlogComponent implements OnInit {
    @Select(UserState.currUser) currentUser$: Observable<FrontendUser>;
    currentUserSubscription: Subscription;
    currentUser: FrontendUser;

    myBlog: Blog;
    ratings = ContentRating;

    migrateBlogForm = new FormGroup({
        title: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]),
        body: new FormControl('', [Validators.required, Validators.minLength(3)]),
        rating: new FormControl(null, [Validators.required])
    });

    constructor(private http: HttpClient, private route: ActivatedRoute, private snackBar: MatSnackBar, private router: Router) {
        this.currentUserSubscription = this.currentUser$.subscribe(x => {
            this.currentUser = x;
        });
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

        const contentBlog: MigrationForm = {
            _id: this.myBlog._id,
            title: this.fields.title.value,
            author: this.currentUser._id,
            body: this.fields.body.value,
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

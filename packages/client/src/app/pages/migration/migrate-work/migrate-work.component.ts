import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { ApprovalStatus, Categories, Work } from '@pulp-fiction/models/works';
import { FrontendUser } from '@pulp-fiction/models/users';
import { WorkKind, Genres, ContentRating, WorkStatus, ContentKind, PubStatus } from '@pulp-fiction/models/content';
import { AuthService } from '../../../services/auth';
import { MigrationForm } from '@pulp-fiction/models/migration';
import { getQuillHtml } from '../../../util/functions';
@Component({
    selector: 'migrate-work',
    templateUrl: './migrate-work.component.html',
    styleUrls: ['./migrate-work.component.less']
})
export class MigrateWorkComponent implements OnInit {
    currentUser: FrontendUser;

    currWork: Work;

    categories = WorkKind;
    genres = Genres;
    ratings = ContentRating;
    statuses = WorkStatus;

    proseForm = new FormGroup({
        title: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]),
        desc: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(250)]),
        body: new FormControl('', [Validators.required, Validators.minLength(3)]),
        category: new FormControl(null, [Validators.required]),
        genres: new FormControl([], [Validators.required, Validators.minLength(1), Validators.maxLength(3)]),
        rating: new FormControl(null, [Validators.required]),
        status: new FormControl(null, [Validators.required])
    });

    constructor(private http: HttpClient, private route: ActivatedRoute, private snackBar: MatSnackBar, private auth: AuthService, private router: Router) {
        this.auth.currUser.subscribe(x => {
            this.currentUser = x;
        });
    }

    ngOnInit(): void {
        this.currWork = this.route.snapshot.data.workData as Work;
        let currCategory: WorkKind = WorkKind.Original;

        console.log(this.currWork.sections);

        switch (this.currWork.meta.category) {
            case Categories.OriginalFiction:
                currCategory = WorkKind.Original;
                break;
            case Categories.Fanfiction:
                currCategory = WorkKind.Fanwork;
                break;
            default:
                currCategory = currCategory;
                break;
        }

        this.proseForm.setValue({
            title: this.currWork.title,
            desc: this.currWork.shortDesc,
            body: this.currWork.longDesc,
            category: currCategory,
            genres: this.currWork.meta.genres,
            rating: this.currWork.meta.rating,
            status: this.currWork.meta.status
        });
    }

    get fields() { return this.proseForm.controls; }

    migrateWork() {
        if (this.proseForm.invalid) {
            this.snackBar.open(`Looks like something's wrong with the stuff you've entered.`);
            return;
        }

        const bodyValue = this.currWork.usesNewEditor 
            ? this.fields.body.value
            : getQuillHtml(document.querySelector("quill-editor"));

        let publishStatus: PubStatus = PubStatus.Unpublished;

        switch (this.currWork.audit.published) {
            case ApprovalStatus.Approved:
                publishStatus = PubStatus.Published;
                break;
            case ApprovalStatus.NotSubmitted:
                publishStatus = PubStatus.Unpublished;
                break;
            case ApprovalStatus.Pending:
                publishStatus = PubStatus.Pending;
                break;
            case ApprovalStatus.Rejected:
                publishStatus = PubStatus.Rejected;
                break;
            case ApprovalStatus.ApprovedUnpublished:
                publishStatus = PubStatus.ApprovedUnpublished;
                break;
            default:
                publishStatus = PubStatus.Unpublished;
                break;
        }

        const contentWork: MigrationForm = {
            _id: this.currWork._id,
            title: this.fields.title.value,
            author: this.currentUser._id,
            desc: this.fields.desc.value,
            body: bodyValue,
            sections: this.currWork.sections as any,
            meta: {
                rating: this.fields.rating.value,
                category: this.fields.category.value,
                genres: this.fields.genres.value,
                status: this.fields.status.value,
                coverArt: this.currWork.meta.coverArt
            },
            stats: {
                words: this.currWork.stats.totWords,
                views: this.currWork.stats.views,
                likes: this.currWork.stats.likes,
                dislikes: this.currWork.stats.dislikes,
                comments: this.currWork.stats.comments
            },
            published: publishStatus,
            publishedOn: this.currWork.audit.publishedOn,
            kind: ContentKind.ProseContent,
            createdAt: this.currWork.createdAt,
            updatedAt: this.currWork.updatedAt
        };

        this.saveMigration(contentWork).subscribe(() => {
            this.router.navigate(['/migration']);
        });
    }

    private saveMigration(formData: MigrationForm) {
        return this.http.put<void>(`/api/migration/save-migration`, formData, {observe: 'response', withCredentials: true})
            .pipe(map(res => {
                return res.body;
            }), catchError(err => {
                this.snackBar.open(`Something went wrong with this work's migration!`);
                return throwError(err);
            }));
    }
}
import { Component, OnInit } from '@angular/core';
import {
    ContentKind,
    ContentModel,
    ContentRating,
    NewsForm,
    PubChange,
    PubStatus,
} from '@dragonfish/shared/models/content';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NewsCategory, NewsContentModel } from '@dragonfish/shared/models/content';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { AlertsService } from '@dragonfish/client/alerts';
import { MyStuffService, MyStuffQuery } from '@dragonfish/client/repository/my-stuff';
import { Router } from '@angular/router';
import { PopupModel } from '@dragonfish/shared/models/util';
import { PopupComponent } from '@dragonfish/client/ui';
import { MatDialog } from '@angular/material/dialog';
import { MAX_TITLE_LENGTH, MIN_TEXT_LENGTH } from '@dragonfish/shared/constants/content-constants';

@UntilDestroy()
@Component({
    selector: 'dragonfish-news-form',
    templateUrl: './news-form.component.html',
    styleUrls: ['./news-form.component.scss'],
})
export class NewsFormComponent implements OnInit {
    formTitle = `Create a Newspost`;
    editMode = false;
    ratings = ContentRating;
    categories = NewsCategory;
    pubStatus = PubStatus;

    postForm = new FormGroup({
        title: new FormControl('', [Validators.required, Validators.minLength(MIN_TEXT_LENGTH), Validators.maxLength(MAX_TITLE_LENGTH)]),
        body: new FormControl('', [Validators.required, Validators.minLength(MIN_TEXT_LENGTH)]),
        category: new FormControl(null, [Validators.required]),
    });

    constructor(
        private alerts: AlertsService,
        private stuff: MyStuffService,
        public stuffQuery: MyStuffQuery,
        private router: Router,
        private dialog: MatDialog,
    ) {}

    ngOnInit(): void {
        this.stuffQuery.current$.pipe(untilDestroyed(this)).subscribe((content: NewsContentModel) => {
            if (content !== null) {
                this.formTitle = `Viewing "${content.title}"`;
                this.postForm.setValue({
                    title: content.title,
                    body: content.body,
                    category: content.meta.category,
                });
            } else {
                this.formTitle = `Create a Newspost`;
                this.postForm.setValue({
                    title: '',
                    body: '',
                    category: null,
                });
            }
        });
    }

    get fields() {
        return this.postForm.controls;
    }

    goBack() {
        this.router.navigate(['/my-stuff'])
    }

    switchView = () => this.editMode = !this.editMode;

    /**
     * Sends a request to publish the specified content given its info.
     *
     * @param content The content to publish
     */
    publish(content: ContentModel) {
        const pubChange: PubChange = {
            oldStatus: content.audit.published,
            newStatus: content.audit.published === PubStatus.Unpublished ? PubStatus.Published : PubStatus.Unpublished,
        };

        this.stuff.publish(content._id, pubChange).subscribe();
    }

    /**
     * Asks if a user really wants to delete the specified content. If yes,
     * sends a request to delete the specified content given its ID. If no,
     * does nothing.
     */
    deleteContent(content: ContentModel) {
        const alertData: PopupModel = {
            message: 'Are you sure you want to delete this? This action is irreversible.',
            confirm: true,
        };
        const dialogRef = this.dialog.open(PopupComponent, { data: alertData });
        dialogRef.afterClosed().pipe(untilDestroyed(this)).subscribe((wantsToDelete: boolean) => {
            if (wantsToDelete) {
                this.stuff.delete(content._id).subscribe(() => {
                    this.router.navigate(['/my-stuff'])
                });
            }
        });
    }

    submitForm(contentId?: string) {
        if (this.fields.title.invalid) {
            this.alerts.warn('Title field has an invalid length.');
            return;
        }
        if (this.fields.body.invalid) {
            this.alerts.warn('Body text is too short.');
            return;
        }
        if (this.fields.category.invalid) {
            this.alerts.warn('Category is required.');
            return;
        }

        const formData: NewsForm = {
            title: this.fields.title.value,
            body: this.fields.body.value,
            category: this.fields.category.value,
        };

        if (contentId) {
            this.stuff.save(contentId, ContentKind.NewsContent, formData).subscribe(() => {
                this.editMode = false;
            });
        } else {
            this.stuff.create(ContentKind.NewsContent, formData).subscribe(content => {
                this.stuff.setActive(content._id);
                this.router.navigate(['/my-stuff/view-post']);
            });
        }
    }
}

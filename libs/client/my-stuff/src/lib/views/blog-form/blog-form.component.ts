import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
    BlogForm,
    BlogsContentModel,
    ContentRating,
    PubStatus,
    ContentKind,
    ContentModel, PubChange,
} from '@dragonfish/shared/models/content';
import { AlertsService } from '@dragonfish/client/alerts';
import { MyStuffService, MyStuffQuery } from '@dragonfish/client/repository/my-stuff';
import { Router } from '@angular/router';
import { PopupModel } from '@dragonfish/shared/models/util';
import { PopupComponent } from '@dragonfish/client/ui';
import { MatDialog } from '@angular/material/dialog';
import { untilDestroyed } from '@ngneat/until-destroy';
import { ContentConstants } from '@dragonfish/shared/constants';

@Component({
    selector: 'dragonfish-blog-form',
    templateUrl: './blog-form.component.html',
    styleUrls: ['./blog-form.component.scss'],
})
export class BlogFormComponent implements OnInit {
    editMode = false;
    ratings = ContentRating;
    pubStatus = PubStatus;

    formTitle = `Create a Blog`;

    blogForm = new FormGroup({
        title: new FormControl('', [Validators.required, ContentConstants.VAL_MIN_TEXT_LENGTH, ContentConstants.VAL_MAX_TITLE_LENGTH]),
        body: new FormControl('', [Validators.required, ContentConstants.VAL_MIN_TEXT_LENGTH]),
        rating: new FormControl(null, [Validators.required]),
    });

    constructor(
        private alerts: AlertsService,
        private stuff: MyStuffService,
        public stuffQuery: MyStuffQuery,
        private router: Router,
        private dialog: MatDialog
    ) {}

    ngOnInit(): void {
        this.stuffQuery.current$.subscribe((content: BlogsContentModel) => {
            if (content !== null && content !== undefined) {
                this.formTitle = `Viewing "${content.title}"`;
                this.blogForm.setValue({
                    title: content.title,
                    body: content.body,
                    rating: content.meta.rating,
                });
            } else {
                this.formTitle = `Create a Blog`;
                this.blogForm.setValue({
                    title: '',
                    body: '',
                    rating: null,
                });
            }
        });
    }

    get fields() {
        return this.blogForm.controls;
    }

    switchView = () => this.editMode = !this.editMode;

    goBack() {
        this.router.navigate(['/my-stuff']);
    }

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
                    this.router.navigate(['/my-stuff']);
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
        if (this.fields.rating.invalid) {
            this.alerts.warn('Rating is required.');
            return;
        }

        const formData: BlogForm = {
            title: this.fields.title.value,
            body: this.fields.body.value,
            rating: this.fields.rating.value,
        };

        if (contentId) {
            this.stuff.save(contentId, ContentKind.BlogContent, formData).subscribe(() => {
                this.editMode = false;
            });
        } else {
            this.stuff.create(ContentKind.BlogContent, formData).subscribe(content => {
                this.stuff.setActive(content._id);
                this.router.navigate(['/my-stuff/view-blog']);
            });
        }
    }
}

import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { MyStuffState } from '../../../../shared/my-stuff';

import {
    WorkKind,
    Genres,
    ContentRating,
    WorkStatus,
    CreateProse,
    ProseContent,
    ContentKind,
} from '@dragonfish/models/content';
import { AlertsService } from '../../../../shared/alerts';
import { MyStuffService } from '../../my-stuff.service';

@UntilDestroy()
@Component({
    selector: 'prose-form',
    templateUrl: './prose-form.component.html',
    styleUrls: ['./prose-form.component.less'],
})
export class ProseFormComponent implements OnInit {
    @Select(MyStuffState.currContent) currContent$: Observable<ProseContent>;
    formTitle = `Create New Prose`;

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
        status: new FormControl(null, [Validators.required]),
    });

    constructor(private stuff: MyStuffService, private alerts: AlertsService) {}

    ngOnInit(): void {
        this.currContent$.pipe(untilDestroyed(this)).subscribe((content) => {
            if (content !== null) {
                this.formTitle = `Editing "${content.title}"`;
                this.proseForm.setValue({
                    title: content.title,
                    desc: content.desc,
                    body: content.body,
                    category: content.meta.category,
                    genres: content.meta.genres,
                    rating: content.meta.rating,
                    status: content.meta.status,
                });
            } else {
                this.proseForm.setValue({
                    title: '',
                    desc: '',
                    body: '',
                    category: null,
                    genres: [],
                    rating: null,
                    status: null,
                });
            }
        });
    }

    get fields() {
        return this.proseForm.controls;
    }

    submitForm(contentId?: string) {
        if (this.proseForm.invalid) {
            this.alerts.warn(`Looks like something's wrong with the stuff you've entered.`);
            return;
        }

        const proseInfo: CreateProse = {
            title: this.fields.title.value,
            desc: this.fields.desc.value,
            body: this.fields.body.value,
            category: this.fields.category.value,
            genres: this.fields.genres.value,
            rating: this.fields.rating.value,
            status: this.fields.status.value,
        };

        if (contentId) {
            this.stuff.saveContent(contentId, ContentKind.ProseContent, proseInfo);
        } else {
            this.stuff.createContent(ContentKind.ProseContent, proseInfo);
        }
    }
}

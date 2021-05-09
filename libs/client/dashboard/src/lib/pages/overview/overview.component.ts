import { Component, Injectable, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Tag, TagsForm } from '@dragonfish/shared/models/tags';
import { handleResponse } from '@dragonfish/shared/functions';

import {
    WorkKind,
    Genres,
    ContentRating,
    WorkStatus,
    CreateProse,
    ProseContent,
    ContentKind,
} from '@dragonfish/shared/models/content';
import { AlertsService } from '@dragonfish/client/alerts';
import { HttpClient } from '@angular/common/http';

@UntilDestroy()
@Component({
    selector: 'dragonfish-overview',
    templateUrl: './overview.component.html',
    styleUrls: ['./overview.component.scss'],
})
@Injectable()
export class OverviewComponent implements OnInit {
    private baseUrl = `/api`;
    formTitle = `Add Tag`;
    output: String;

    categories = WorkKind;
    genres = Genres;
    ratings = ContentRating;
    statuses = WorkStatus;

    proseForm = new FormGroup({
        name: new FormControl('', []),
    });

    constructor(private readonly http: HttpClient) {}

    ngOnInit(): void {
    }

    get fields() {
        return this.proseForm.controls;
    }

    submitForm() {
        const tagForm: TagsForm = {
            name: this.fields.name.value,
            desc: "Default description",
            parent: "Default parent",
            children: null,
        };

        this.createTag(tagForm).subscribe(() => {
            this.output = "Sent tag";
        });
    }

    public createTag(tagInfo: TagsForm) {
        return handleResponse(
            this.http.put<Tag>(`${this.baseUrl}/tags/create-tag`, tagInfo, {
                observe: 'response',
                withCredentials: true,
            }),
        );
    }
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ProseContent, PubStatus } from '@pulp-fiction/models/content';
import { SectionsService } from 'packages/client/src/app/services/user';
import { SectionItem } from '../../viewmodels';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SectionForm } from '@pulp-fiction/models/sections';

@Component({
    selector: 'view-prose',
    templateUrl: './view-prose.component.html',
    styleUrls: ['./view-prose.component.less']
})
export class ViewProseComponent implements OnInit {
    myProse: ProseContent;
    mySections: SectionItem[];
    pubStatus = PubStatus;
    loadingSections = false;
    editMode = false;

    selectedSection: SectionItem;

    sectionForm = new FormGroup({
        title: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]),
        body: new FormControl('', [Validators.required, Validators.minLength(3)]),
        authorsNote: new FormControl('', [Validators.minLength(3)]),
        authorsNotePos: new FormControl(null)
    });

    constructor(private sectionsService: SectionsService, public route: ActivatedRoute, private location: Location, private snackBar: MatSnackBar) {}

    ngOnInit(): void {
        this.myProse = this.route.snapshot.data.proseData as ProseContent;
        this.fetchData();
    }

    goBack() {
        this.location.back();
    }

    get fields() { return this.sectionForm.controls; }

    private fetchData() {
        this.loadingSections = true;
        this.sectionsService.fetchUserContentSections(this.myProse._id).subscribe(sections => {
            this.mySections = sections.reverse() as SectionItem[];
            this.loadingSections = false;
        });
    }

    addSection() {
        this.editMode = true;
    }

    selectThisSection(section: SectionItem) {
        if (this.selectedSection) {
            this.selectedSection.selected = false;
            this.selectedSection = null;
        }
        
        section.selected = true;
        this.selectedSection = section;
    }

    submitForm() {
        if (this.fields.title.invalid) {
            this.snackBar.open(`Chapter titles need to be between 3 and 100 characters long.`);
            return;
        }

        if (this.fields.body.invalid) {
            this.snackBar.open(`Chapters need to be more than 3 characters long.`);
            return;
        }

        if (this.fields.authorsNote.invalid) {
            this.snackBar.open(`Authors notes need to be more than 3 characters long.`);
            return;
        }

        const sectionForm: SectionForm = {
            title: this.fields.title.value,
            body: this.fields.body.value,
            authorsNote: this.fields.authorsNote.value,
            authorsNotePos: undefined,
            usesNewEditor: true
        };

        this.sectionsService.createSection(this.myProse._id, sectionForm).subscribe(() => {
            this.editMode = false;
            this.sectionForm.reset();
            this.fetchData();
        });
    }
}
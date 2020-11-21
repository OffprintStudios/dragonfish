import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';

import { PoetryContent, PubStatus, ContentKind } from '@pulp-fiction/models/content';
import { SectionForm } from '@pulp-fiction/models/sections';
import { UploadCoverartComponent } from '../../../../components/modals/works';
import { MyStuffService, SectionsService } from '../../../../services/user';
import { SectionItem } from '../../viewmodels';

@Component({
    selector: 'view-poetry',
    templateUrl: './view-poetry.component.html',
    styleUrls: ['./view-poetry.component.less']
})
export class ViewPoetryComponent implements OnInit {
    myPoetry: PoetryContent;
    mySections: SectionItem[];
    pubStatus = PubStatus;
    loadingSections = false;
    editMode = false;
    addEditIcon = false;

    selectedSection: SectionItem;

    sectionForm = new FormGroup({
        title: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]),
        body: new FormControl('', [Validators.required, Validators.minLength(3)]),
        authorsNote: new FormControl('', [Validators.minLength(3)]),
        authorsNotePos: new FormControl(null)
    });

    constructor(private stuffService: MyStuffService, private sectionsService: SectionsService, public route: ActivatedRoute, 
        private router: Router, private location: Location, private snackBar: MatSnackBar, private dialog: MatDialog) {}

    ngOnInit(): void {
        this.myPoetry = this.route.snapshot.data.poetryData as PoetryContent;
        this.fetchData();
    }

    goBack() {
        this.location.back();
    }

    exitEditMode() {
        this.editMode = false;
    }

    get fields() { return this.sectionForm.controls; }

    private fetchData() {
        this.loadingSections = true;
        this.sectionsService.fetchUserContentSections(this.myPoetry._id).subscribe(sections => {
            this.mySections = sections.reverse() as SectionItem[];
            this.loadingSections = false;
        });
    }

    addSection() {
        if (this.selectedSection) {
            this.selectedSection.selected = false;
            this.selectedSection = null;
        }
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

        this.sectionsService.createSection(this.myPoetry._id, sectionForm).subscribe(() => {
            this.editMode = false;
            this.sectionForm.reset();
            this.fetchData();
        });
    }

    deleteWork() {
        if (confirm(`Are you sure you want to delete this? This action is irreversible.`)) {
            this.stuffService.deleteOne(this.myPoetry._id).subscribe(() => {
                this.router.navigate(['/my-stuff']);
            });
        } else {
            return;
        }
    }

    editWork() {
        this.router.navigate(['/my-stuff/edit-prose'], {queryParams: {contentId: this.myPoetry._id, kind: this.myPoetry.kind}, queryParamsHandling: 'merge'});
    }

    uploadCoverart() {
        const dialogRef = this.dialog.open(UploadCoverartComponent, {data: {kind: ContentKind.PoetryContent, contentId: this.myPoetry._id}});
        dialogRef.afterClosed().subscribe(() => {
            location.reload();
        });
    }
}
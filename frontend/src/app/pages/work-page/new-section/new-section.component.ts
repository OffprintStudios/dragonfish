import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { CreateSection } from 'src/app/models/works';
import { WorksService } from 'src/app/services/content';

@Component({
  selector: 'app-new-section',
  templateUrl: './new-section.component.html',
  styleUrls: ['./new-section.component.less']
})
export class NewSectionComponent implements OnInit {
  loading = false; // Loading check for submission
  workId: string; // The work's ID
  workName: string; // The work's name

  newSectionForm = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]),
    body: new FormControl('', [Validators.required, Validators.minLength(3)]),
    authorsNote: new FormControl('', [Validators.minLength(3), Validators.maxLength(2000)]),
  });

  constructor(private worksService: WorksService, private route: ActivatedRoute, private router: Router, private cdr: ChangeDetectorRef) {
    // Getting the parameters from the parent component
    this.route.parent.paramMap.subscribe(params => {
      this.workId = params.get('workId');
      this.workName = params.get('title');
    });
  }

  ngOnInit(): void {
  }

  /**
   * New section form getter.
   */
  get fields() { return this.newSectionForm.controls; }

  /**
   * Required for the QuillJS editor.
   */
  triggerChangeDetection() {
    return this.cdr.detectChanges();
  }

  /**
   * Sends the new section info to the database.
   */
  submitSection() {
    this.loading = true;

    const newSection: CreateSection = {
      title: this.fields.title.value,
      body: this.fields.body.value,
      authorsNote: this.fields.authorsNote.value
    };
    
    this.worksService.createSection(this.workId, newSection).subscribe(sectionId => {
      this.router.navigate([`/work/` + this.workId + `/` + this.workName + `/section/` + sectionId]);
    }, () => {
      this.loading = false;
    });
  }
}

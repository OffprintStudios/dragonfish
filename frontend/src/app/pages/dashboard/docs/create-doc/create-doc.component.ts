import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from 'src/app/services/auth';
import { DocsService } from 'src/app/services/admin';
import { dividerHandler, imageHandler } from 'src/app/util/quill';
import { AlertsService } from 'src/app/modules/alerts';
import { CreateDoc, User, Roles } from 'shared-models';

@Component({
  selector: 'app-create-doc',
  templateUrl: './create-doc.component.html',
  styleUrls: ['./create-doc.component.less']
})
export class CreateDocComponent implements OnInit {
  currentUser: User;
  rolesList = Roles;
  loading = false;

  editorFormats = [
    'header', 'bold', 'italic', 'underline', 'strike',
    'divider', 'link', 'blockquote', 'code', 'image',
    'align', 'center', 'right', 'justify',
    'list', 'bullet', 'ordered'
  ];

  createDocForm = new FormGroup({
    id: new FormControl('', [Validators.required]),
    docName: new FormControl('', [Validators.required]),
    docDesc: new FormControl('', [Validators.required]),
    docBody: new FormControl('', [Validators.required]),
    approvedRoles: new FormControl([], [Validators.required]),
  });

  constructor(private authService: AuthService, private docsService: DocsService,
    private cdr: ChangeDetectorRef, private alertsService: AlertsService, private router: Router) {
      this.authService.currUser.subscribe(x => { this.currentUser = x; });
    }

  ngOnInit(): void {
  }

  /**
   * Create doc form getter.
   */
  get fields() { return this.createDocForm.controls; }

  /**
   * Required for Quill
   */
  triggerChangeDetection() {
    return this.cdr.detectChanges();
  }

  /**
   * Gets the Quill Editor object after the editor's creation in the template HTML
   * 
   * @param event The editor object
   */
  onEditorCreated(event: any) {
    let toolbar = event.getModule('toolbar');
    toolbar.addHandler('divider', dividerHandler);
    toolbar.addHandler('image', imageHandler);
  }

  /**
   * Submits document to the database.
   */
  submitDoc() {
    if (this.fields.id.invalid) {
      this.alertsService.warn(`ID field cannot be empty.`);
      return;
    }

    if (this.fields.docName.invalid) {
      this.alertsService.warn(`Document name cannot be empty.`);
      return;
    }

    if (this.fields.docDesc.invalid) {
      this.alertsService.warn(`Document description cannot be empty.`);
      return;
    }

    if (this.fields.docBody.invalid) {
      this.alertsService.warn(`Document body cannot be empty.`);
      return;
    }

    if (this.fields.approvedRoles.invalid || this.fields.approvedRoles.value.length === 0) {
      this.alertsService.warn(`Approved roles cannot be empty.`);
      return;
    }

    this.loading = true;
    const docToCreate: CreateDoc = {
      _id: this.fields.id.value,
      docName: this.fields.docName.value,
      docDescription: this.fields.docDesc.value,
      docBody: this.fields.docBody.value,
      approvedRoles: this.fields.approvedRoles.value,
    };

    this.docsService.createDoc(this.currentUser.roles as Roles[], docToCreate).subscribe(() => {
      this.loading = false;
      this.router.navigate(['/dashboard/docs']);
    })
  }
}

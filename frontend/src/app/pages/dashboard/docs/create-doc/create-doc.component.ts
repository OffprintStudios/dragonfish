import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { User, Roles } from 'shared-models';
import { AuthService } from 'src/app/services/auth';
import { DocsService } from 'src/app/services/admin';
import { dividerHandler, imageHandler } from 'src/app/util/quill';

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

  constructor(private authService: AuthService, private docsService: DocsService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
  }

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
}

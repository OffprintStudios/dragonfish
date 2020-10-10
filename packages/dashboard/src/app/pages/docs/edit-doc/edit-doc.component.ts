import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FrontendUser, Roles } from '@pulp-fiction/models/users';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Doc, EditDoc } from '@pulp-fiction/models/docs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth';
import { DocsService } from '../../../services/contrib/docs';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit-doc',
  templateUrl: './edit-doc.component.html',
  styleUrls: ['./edit-doc.component.less']
})
export class EditDocComponent implements OnInit {
  currentUser: FrontendUser;
  docId: string;
  docToEdit: Doc;
  rolesList = Roles;
  loading = false;
  submitting = false;

  editDocForm = new FormGroup({
    docName: new FormControl('', [Validators.required]),
    docBody: new FormControl('', [Validators.required, Validators.minLength(3)]),
  });

  constructor(private authService: AuthService, private docsService: DocsService, private snackBar: MatSnackBar, private router: Router,
    private route: ActivatedRoute) {
      this.authService.currUser.subscribe(x => { this.currentUser = x; });
      this.fetchData();
    }

  ngOnInit(): void {
  }

  /**
   * Fetches the relevant data from the database.
   */
  private fetchData() {
    this.loading = true;
    this.route.paramMap.subscribe(params => {
      this.docId = params.get('docId');
      this.docsService.fetchForEdit(this.docId).subscribe(doc => {
        this.docToEdit = doc;
        this.editDocForm.setValue({
          docName: doc.docName,
          docBody: doc.docBody
        });
        this.loading = false;
      });
    });
  }

  /**
   * Edit doc form getter.
   */
  get fields() { return this.editDocForm.controls; }

  /**
   * Submits document edits to the database.
   */
  submitDocEdits() {
    if (this.fields.docName.invalid) {
      this.snackBar.open(`Document name cannot be empty.`);
      return;
    }

    if (this.fields.docBody.invalid) {
      this.snackBar.open(`Document body cannot be empty.`);
      return;
    }
    this.submitting = true;

    const docToEdit: EditDoc = {
      _id: this.docId,
      docTitle: this.fields.docName.value,
      docBody: this.fields.docBody.value,
      usesNewEditor: true
    };

    this.docsService.editDoc(docToEdit).subscribe(() => {
      this.submitting = false;
      this.router.navigate(['/dashboard/docs']);
    })
  }
}

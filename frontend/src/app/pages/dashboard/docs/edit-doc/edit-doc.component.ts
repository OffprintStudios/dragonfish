import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { User, Roles } from 'shared-models';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth';
import { DocsService } from 'src/app/services/admin';
import { AlertsService } from 'src/app/modules/alerts';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-doc',
  templateUrl: './edit-doc.component.html',
  styleUrls: ['./edit-doc.component.less']
})
export class EditDocComponent implements OnInit {
  currentUser: User;
  rolesList = Roles;
  loading = false;

  editorFormats = [
    'header', 'bold', 'italic', 'underline', 'strike',
    'divider', 'link', 'blockquote', 'code', 'image',
    'align', 'center', 'right', 'justify',
    'list', 'bullet', 'ordered'
  ];

  editDocForm = new FormGroup({
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

}

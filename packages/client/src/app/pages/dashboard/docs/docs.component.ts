import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import * as lodash from 'lodash';

import { DocsService } from '../../../services/admin';
import { AuthService } from '../../../services/auth';
import { AlertsService } from '../../../modules/alerts';
import { FrontendUser, Roles } from '@pulp-fiction/models/users';
import { Doc } from '@pulp-fiction/models/docs';

@Component({
  selector: 'app-docs',
  templateUrl: './docs.component.html',
  styleUrls: ['./docs.component.less']
})
export class DocsComponent implements OnInit {
  currentUser: FrontendUser;
  docs: Doc[];

  constructor(private docsService: DocsService, private authService: AuthService,
    private router: Router, private alertsService: AlertsService, public route: ActivatedRoute) {
    this.authService.currUser.subscribe(x => { this.currentUser = x; });
    this.fetchData();
  }

  ngOnInit(): void {
  }

  /**
   * Fetches all docs from the backend.
   */
  private fetchData() {
    this.docsService.fetchForDashboard().subscribe(docs => {
      this.docs = docs;
      console.log(docs);
    });
  }

  /**
   * Checks to see if you're an admin.
   */
  isAdmin() {
    const allowedRoles: Roles[] = [Roles.Admin];
    const isAllowed = lodash.intersection(allowedRoles, this.currentUser.roles);
    if (isAllowed.length > 0) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Switches to the Create Doc page if you're an admin.
   */
  switchToCreateDoc() {
    if (this.currentUser) {
      const allowedRoles: Roles[] = [Roles.Admin];
      const isAllowed = lodash.intersection(allowedRoles, this.currentUser.roles);
      if (isAllowed.length > 0) {
        this.router.navigate(['/dashboard/docs/create-doc']);
        return;
      } else {
        this.alertsService.error(`You must be an admin to create new site docs.`);
      }
    } else {
      return;
    }
  }

  /**
   * Switches to edit view for the provided document.
   * 
   * @param doc The doc to edit
   */
  editDoc(doc: Doc) {
    if (this.currentUser) {
      const isAllowed = lodash.intersection(doc.audit.approvedRoles, this.currentUser.roles);
      if (isAllowed.length > 0) {
        this.router.navigate([`/dashboard/docs/edit-doc/${doc._id}`]);
        return;
      } else {
        this.alertsService.error(`You don't have permission to edit this document.`)
      }
    } else {
      return;
    }
  }
}

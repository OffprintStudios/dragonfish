import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import * as lodash from 'lodash';

import { DocsService } from 'src/app/services/admin';
import { AuthService } from 'src/app/services/auth';
import { AlertsService } from 'src/app/modules/alerts';
import { Doc, User, Roles } from 'shared-models';

@Component({
  selector: 'app-docs',
  templateUrl: './docs.component.html',
  styleUrls: ['./docs.component.less']
})
export class DocsComponent implements OnInit {
  currentUser: User;
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
}

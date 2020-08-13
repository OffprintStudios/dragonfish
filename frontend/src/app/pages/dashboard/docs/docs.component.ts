import { Component, OnInit } from '@angular/core';
import { DocsService } from 'src/app/services/admin';
import { AuthService } from 'src/app/services/auth';
import { Doc, User } from 'shared-models';

@Component({
  selector: 'app-docs',
  templateUrl: './docs.component.html',
  styleUrls: ['./docs.component.less']
})
export class DocsComponent implements OnInit {
  currentUser: User;
  docs: Doc[];

  constructor(private docsService: DocsService, private authService: AuthService) {
    this.authService.currUser.subscribe(x => { this.currentUser = x; });
    this.fetchData();
  }

  ngOnInit(): void {
  }

  private fetchData() {
    this.docsService.fetchForDashboard().subscribe(docs => {
      this.docs = docs;
      console.log(docs);
    });
  }
}

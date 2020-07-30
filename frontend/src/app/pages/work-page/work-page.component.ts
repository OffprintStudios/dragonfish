import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Toppy } from 'toppy';

import { User } from 'src/app/models/users';
import * as workModels from 'src/app/models/works';
import { AuthService } from 'src/app/services/auth';
import { WorksService } from 'src/app/services/content';

@Component({
  selector: 'app-work-page',
  templateUrl: './work-page.component.html',
  styleUrls: ['./work-page.component.less']
})
export class WorkPageComponent implements OnInit {
  currentUser: User; // The currently logged in user
  loading = false; // Loading check for fetching data

  workId: string; // This work's ID
  workData: workModels.Work; // This work's data
  pubSections: workModels.SectionInfo[];

  constructor(private authService: AuthService, private worksService: WorksService,
    public route: ActivatedRoute, private router: Router, private toppy: Toppy) {
      this.authService.currUser.subscribe(x => { this.currentUser = x; });
      this.fetchData();
    }

  ngOnInit(): void {
  }

  /**
   * Fetches the requisite work from the database.
   */
  private fetchData() {
    this.loading = true;
    this.route.paramMap.subscribe(params => {
      this.workId = params.get('workId');
      this.worksService.fetchWork(this.workId).subscribe(work => {
        this.workData = work;
        this.pubSections = work.sections.filter(section => { return section.published === true; });
        this.loading = false;
      }, () => {
        this.loading = false;
      });
    });
  }

  /**
   * Confirms that the user really wants to delete their work. If true, send the request
   * to the backend. If false, do nothing.
   * 
   * @param workId The ID of the work we're deleting
   */
  askDelete(workId: string) {
    if (confirm('Are you sure you want to delete this work? This action is irreversible.')) {
      this.worksService.deleteWork(workId).subscribe(() => {
        this.router.navigate(['/home/works']);
        return;
      }, err => {
        console.log(err);
        return;
      });
    } else {
      return;
    }
  }
}

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
  currentUser: User;
  loading = false;

  workId: string;
  workData: workModels.Work;

  constructor(private authService: AuthService, private worksService: WorksService,
    public route: ActivatedRoute, private router: Router, private toppy: Toppy) {
      this.authService.currUser.subscribe(x => { this.currentUser = x; });
      this.fetchData();
    }

  ngOnInit(): void {
  }

  private fetchData() {
    this.loading = true;
    this.route.paramMap.subscribe(params => {
      this.workId = params.get('workId');
      this.worksService.fetchWork(this.workId).subscribe(work => {
        this.workData = work;
        this.loading = false;
      }, () => {
        this.loading = false;
      });
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { User } from 'src/app/models/users';
import { AuthService } from 'src/app/services/auth';
import { PortfolioService } from 'src/app/services/content';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.less']
})
export class PortfolioComponent implements OnInit {
  portUser: User; // The user whose portfolio this is
  portUserId: string; // Their ID, fetched from the route parameters

  currentUser: User;

  constructor(private authService: AuthService, private router: Router, private route: ActivatedRoute, private portService: PortfolioService) {
    this.authService.currUser.subscribe(x => {
      this.currentUser = x;
    });
    this.fetchData();
  }

  ngOnInit(): void {
  }

  private fetchData() {
    this.route.paramMap.subscribe(params => {
      this.portUserId = params.get('id');
    });
    this.portService.getUserInfo(this.portUserId).subscribe(x => {
      this.portUser = x;
    })
  }

}

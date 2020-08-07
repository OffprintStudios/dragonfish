import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/users';
import { AuthService } from 'src/app/services/auth';

@Component({
  selector: 'app-contrib',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.less']
})
export class DashboardComponent implements OnInit {
  currentUser: User;

  constructor(private authService: AuthService) {
    this.authService.currUser.subscribe(x => { this.currentUser = x; });
  }

  ngOnInit(): void {
  }

}

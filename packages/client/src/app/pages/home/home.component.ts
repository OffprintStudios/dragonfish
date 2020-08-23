import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth';
import { FrontendUser } from '@pulp-fiction/models/users';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit {
  currentUser: FrontendUser;

  constructor(private authService: AuthService) {
    this.authService.currUser.subscribe(x => this.currentUser = x);
  }
  ngOnInit(): void {}
}

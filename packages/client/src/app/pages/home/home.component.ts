import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth';
import { FrontendUser } from '@pulp-fiction/models/users';
import { Constants } from '../../shared/constants';
import { Title } from '../../shared';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit {
  currentUser: FrontendUser;
  siteVersion = Constants.siteVersion;

  constructor(private authService: AuthService) {
    this.authService.currUser.subscribe(x => this.currentUser = x);
  }
  ngOnInit(): void {
    Title.setTwoPartTitle(Constants.HOME);
  }
}

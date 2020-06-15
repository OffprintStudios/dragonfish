import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth';
import { User } from 'src/app/models/users';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit {
  currentUser: User;

  constructor(private authService: AuthService) {
    this.authService.currUser.subscribe(x => this.currentUser = x);
  }
  ngOnInit(): void {}
}

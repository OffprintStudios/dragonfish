import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/users';
import { AuthService } from 'src/app/services/auth';

@Component({
  selector: 'app-contrib',
  templateUrl: './contrib.component.html',
  styleUrls: ['./contrib.component.less']
})
export class ContribComponent implements OnInit {
  currentUser: User;

  constructor(private authService: AuthService) {
    this.authService.currUser.subscribe(x => { this.currentUser = x; });
  }

  ngOnInit(): void {
  }

}

import { Component, OnInit } from '@angular/core';

import { User } from 'src/app/models/users';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.less']
})
export class PortfolioComponent implements OnInit {
  portUser: User;


  constructor() { }

  ngOnInit(): void {
  }

}

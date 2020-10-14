import { Component, OnInit } from '@angular/core';
import { GlobalConstants } from '../../shared';
import { GlobalMethods } from '../../shared/global-methods';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.less']
})
export class NewsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    GlobalMethods.setTwoPartTitle(GlobalConstants.NEWS);
  }

}

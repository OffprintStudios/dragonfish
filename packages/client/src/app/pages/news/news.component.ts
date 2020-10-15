import { Component, OnInit } from '@angular/core';
import { Constants, Title } from '../../shared';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.less']
})
export class NewsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    Title.setTwoPartTitle(Constants.NEWS);
  }

}

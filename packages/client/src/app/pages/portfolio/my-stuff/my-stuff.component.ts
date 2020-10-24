import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'pulp-fiction-my-stuff',
  templateUrl: './my-stuff.component.html',
  styleUrls: ['./my-stuff.component.less']
})
export class MyStuffComponent implements OnInit {

  searchStuff = new FormGroup({
    query: new FormControl('')
  });

  constructor() { }

  ngOnInit(): void {
  }

}

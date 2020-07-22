import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Toppy, ToppyControl } from 'toppy';

import { User } from 'src/app/models/users';
import { Work } from 'src/app/models/works';

@Component({
  selector: 'app-works',
  templateUrl: './works.component.html',
  styleUrls: ['./works.component.less']
})
export class WorksComponent implements OnInit {
  currentUser: User;
  works: Work[];
  newWorkForm: ToppyControl;

  loading = false;
  isUnpubFiltered = false;
  isPubFiltered = false;

  searchWorks = new FormGroup({
    query: new FormControl(''),
  });

  constructor() { }

  ngOnInit(): void {
  }

  filterByUnpublished() {

  }

  filterByPublished() {

  }

  clearFilter() {

  }

  openNewWorkForm() {

  }

  isWorksEmpty() {

  }

  openEditForm(work: Work) {

  }

  askDelete(workId: string) {

  }

  searchFor() {
    
  }
}

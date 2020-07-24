import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';

import * as models from 'src/app/models/works';
import { WorksService } from 'src/app/services/content';

@Component({
  selector: 'app-new-work',
  templateUrl: './new-work.component.html',
  styleUrls: ['./new-work.component.less']
})
export class NewWorkComponent implements OnInit {
  close: any;

  newWorkForm = new FormGroup({
    title: new FormControl(''),
    shortDesc: new FormControl(''),
    longDesc: new FormControl(''),
  })

  constructor(private worksService: WorksService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
  }

}

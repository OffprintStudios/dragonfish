import { Component, OnInit } from '@angular/core';
import { Constants, Title } from '../../../shared';

@Component({
  selector: 'app-site-staff',
  templateUrl: './site-staff.component.html',
  styleUrls: ['./site-staff.component.less']
})
export class SiteStaffComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    Title.setTwoPartTitle(Constants.SITE_STAFF);
  }

}

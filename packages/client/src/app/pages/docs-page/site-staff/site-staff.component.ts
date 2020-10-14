import { Component, OnInit } from '@angular/core';
import { GlobalConstants } from '../../../shared';
import { GlobalMethods } from '../../../shared/global-methods';

@Component({
  selector: 'app-site-staff',
  templateUrl: './site-staff.component.html',
  styleUrls: ['./site-staff.component.less']
})
export class SiteStaffComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    GlobalMethods.setTwoPartTitle(GlobalConstants.SITE_STAFF);
  }

}

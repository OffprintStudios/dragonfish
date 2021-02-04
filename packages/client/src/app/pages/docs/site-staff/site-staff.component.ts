import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FrontendUser } from '@dragonfish/models/users';

@Component({
    selector: 'site-staff',
    templateUrl: './site-staff.component.html',
    styleUrls: ['./site-staff.component.less'],
})
export class SiteStaffComponent implements OnInit {
    staffData: FrontendUser[];

    constructor(private route: ActivatedRoute) {}

    ngOnInit(): void {
        this.staffData = this.route.snapshot.data.staffData as FrontendUser[];
    }
}

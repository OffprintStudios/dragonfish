import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FrontendUser } from '@dragonfish/shared/models/users';

@Component({
    selector: 'dragonfish-site-staff',
    templateUrl: './site-staff.component.html',
})
export class SiteStaffComponent implements OnInit {
    staffData: FrontendUser[];

    constructor(private route: ActivatedRoute) {}

    ngOnInit(): void {
        this.staffData = this.route.snapshot.data.staffData as FrontendUser[];
        console.log(this.staffData);
    }
}

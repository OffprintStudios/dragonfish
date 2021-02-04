import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FrontendUser } from '@dragonfish/models/users';

@Component({
    selector: 'supporters',
    templateUrl: './supporters.component.html',
    styleUrls: ['./supporters.component.less'],
})
export class SupportersComponent implements OnInit {
    supporters: FrontendUser[];

    constructor(private route: ActivatedRoute) {}

    ngOnInit(): void {
        this.supporters = this.route.snapshot.data.supporterData as FrontendUser[];
    }
}

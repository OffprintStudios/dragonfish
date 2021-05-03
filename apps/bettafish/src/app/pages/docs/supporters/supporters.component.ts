import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FrontendUser } from '@dragonfish/shared/models/users';
import { Constants, setTwoPartTitle } from '@dragonfish/shared/constants';

@Component({
    selector: 'dragonfish-supporters',
    templateUrl: './supporters.component.html',
})
export class SupportersComponent implements OnInit {
    supporters: FrontendUser[];

    constructor(private route: ActivatedRoute) {}

    ngOnInit(): void {
        setTwoPartTitle(Constants.SUPPORTERS);
    
        this.supporters = this.route.snapshot.data.supporterData as FrontendUser[];
    }
}

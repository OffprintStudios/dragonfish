import { Component, OnInit } from '@angular/core';
import { setThreePartTitle, Constants } from '@dragonfish/shared/constants';

@Component({
    selector: 'dragonfish-overview',
    templateUrl: './overview.component.html',
    styleUrls: ['./overview.component.scss'],
})
export class OverviewComponent implements OnInit {
    ngOnInit(): void {
        setThreePartTitle(Constants.DASHBOARD, Constants.OVERVIEW);
    }
}

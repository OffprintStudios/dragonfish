import { Component } from '@angular/core';
import { Select } from '@ngxs/store';
import { PortfolioState } from '@dragonfish/client/repository/portfolio';
import { Observable } from 'rxjs';
import { FrontendUser } from '@dragonfish/shared/models/users';
import { SessionQuery } from '@dragonfish/client/repository/session';

@Component({
    selector: 'dragonfish-portfolio-toolbar',
    templateUrl: './portfolio-toolbar.component.html',
    styleUrls: ['./portfolio-toolbar.component.scss']
})
export class PortfolioToolbarComponent {
    @Select(PortfolioState.currPortfolio) portUser$: Observable<FrontendUser>;

    constructor(public sessionQuery: SessionQuery) {}
}

import { Component, Input } from '@angular/core';
import { Select } from '@ngxs/store';
import { PortfolioState } from '../../../repo/portfolio';
import { Observable } from 'rxjs';
import { FrontendUser } from '@dragonfish/shared/models/users';
import { UserState } from '../../../repo/user';

@Component({
    selector: 'dragonfish-portfolio-toolbar',
    templateUrl: './portfolio-toolbar.component.html',
    styleUrls: ['./portfolio-toolbar.component.scss']
})
export class PortfolioToolbarComponent {
    @Select(PortfolioState.currPortfolio) portUser$: Observable<FrontendUser>;
    @Select(UserState.currUser) currentUser$: Observable<FrontendUser>;
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FrontendUser } from '@dragonfish/shared/models/users';
import { setTwoPartTitle } from '@dragonfish/shared/constants';
import { Select } from '@ngxs/store';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Observable } from 'rxjs';
import { UserState } from '../../repo/user';
import { PortfolioState } from '../../repo/portfolio';

@UntilDestroy()
@Component({
    selector: 'dragonfish-portfolio',
    templateUrl: './portfolio.component.html',
    styleUrls: ['./portfolio.component.scss']
})
export class PortfolioComponent implements OnInit {
    @Select(PortfolioState.currPortfolio) portUser$: Observable<FrontendUser>;
    @Select(UserState.currUser) currentUser$: Observable<FrontendUser>;

    constructor(public route: ActivatedRoute) {}

    ngOnInit(): void {
        this.portUser$.pipe(untilDestroyed(this)).subscribe(user => {
            setTwoPartTitle(user.username);
        });
    }
}

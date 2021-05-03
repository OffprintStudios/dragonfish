import { Component, OnInit } from '@angular/core';
import { FrontendUser } from '@dragonfish/shared/models/users';
import { Constants, setThreePartTitle } from '@dragonfish/shared/constants';
import { Select } from '@ngxs/store';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Observable } from 'rxjs';
import { PortfolioState } from '../../../repo/portfolio';

@UntilDestroy()
@Component({
    selector: 'dragonfish-portfolio-home',
    templateUrl: './portfolio-home.component.html'
})
export class PortfolioHomeComponent implements OnInit {
    @Select(PortfolioState.currPortfolio) portUser$: Observable<FrontendUser>;

    ngOnInit(): void {
        this.portUser$.pipe(untilDestroyed(this)).subscribe(user => {
            setThreePartTitle(user.username, Constants.HOME);
        });
    }}

import { Component, OnInit } from '@angular/core';
import { FrontendUser } from '@dragonfish/shared/models/users';
import { Constants, setThreePartTitle } from '@dragonfish/shared/constants';
import { Select } from '@ngxs/store';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Observable } from 'rxjs';
import { PortfolioState } from '../../../repo/portfolio';
import { DragonfishNetworkService } from '@dragonfish/client/services';
import { BlogsContentModel, ContentFilter, ContentModel } from '@dragonfish/shared/models/content';
import { SelectSnapshot } from '@ngxs-labs/select-snapshot';
import { GlobalState } from '../../../repo/global';

@UntilDestroy()
@Component({
    selector: 'dragonfish-portfolio-home',
    templateUrl: './portfolio-home.component.html'
})
export class PortfolioHomeComponent implements OnInit {
    @Select(PortfolioState.currPortfolio) portUser$: Observable<FrontendUser>;
    @SelectSnapshot(GlobalState.filter) filter: ContentFilter;
    loading = false;
    works: ContentModel[];
    blogs: BlogsContentModel[];

    constructor(private network: DragonfishNetworkService) { }

    ngOnInit(): void {
        this.portUser$.pipe(untilDestroyed(this)).subscribe(user => {
            this.fetchData(user._id);
            setThreePartTitle(user.username, Constants.HOME);
        });
    }

    private fetchData(userId: string) {
        this.loading = true;
        this.network.fetchUserProfile(userId, this.filter).subscribe(data => {
            this.works = data.works;
            this.blogs = data.blogs as BlogsContentModel[];
            this.loading = false;
        });
    }
}

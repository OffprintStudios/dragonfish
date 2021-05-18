import { Component, OnInit } from '@angular/core';
import { Constants, setThreePartTitle } from '@dragonfish/shared/constants';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { DragonfishNetworkService } from '@dragonfish/client/services';
import { BlogsContentModel, ContentFilter, ContentModel } from '@dragonfish/shared/models/content';
import { SelectSnapshot } from '@ngxs-labs/select-snapshot';
import { GlobalState } from '@dragonfish/client/repository/global';
import { PortfolioQuery } from '@dragonfish/client/repository/portfolio';

@UntilDestroy()
@Component({
    selector: 'dragonfish-portfolio-home',
    templateUrl: './portfolio-home.component.html'
})
export class PortfolioHomeComponent implements OnInit {
    @SelectSnapshot(GlobalState.filter) filter: ContentFilter;
    loading = false;
    works: ContentModel[];
    blogs: BlogsContentModel[];

    constructor(private network: DragonfishNetworkService, public portQuery: PortfolioQuery) { }

    ngOnInit(): void {
        this.portQuery.portUser$.pipe(untilDestroyed(this)).subscribe(user => {
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

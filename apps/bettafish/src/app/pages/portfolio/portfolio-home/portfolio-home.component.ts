import { Component, OnInit } from '@angular/core';
import { Constants, setThreePartTitle } from '@dragonfish/shared/constants';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { DragonfishNetworkService } from '@dragonfish/client/services';
import { BlogsContentModel, ContentModel } from '@dragonfish/shared/models/content';
import { PortfolioQuery } from '@dragonfish/client/repository/portfolio';
import { AppQuery } from '@dragonfish/client/repository/app';

@UntilDestroy()
@Component({
    selector: 'dragonfish-portfolio-home',
    templateUrl: './portfolio-home.component.html'
})
export class PortfolioHomeComponent implements OnInit {
    loading = false;
    works: ContentModel[];
    blogs: BlogsContentModel[];

    constructor(
        private network: DragonfishNetworkService,
        public portQuery: PortfolioQuery,
        private appQuery: AppQuery,
    ) { }

    ngOnInit(): void {
        this.portQuery.portUser$.pipe(untilDestroyed(this)).subscribe(user => {
            this.fetchData(user._id);
            setThreePartTitle(user.username, Constants.HOME);
        });
    }

    private fetchData(userId: string) {
        this.loading = true;
        this.network.fetchUserProfile(userId, this.appQuery.filter).subscribe(data => {
            this.works = data.works;
            this.blogs = data.blogs as BlogsContentModel[];
            this.loading = false;
        });
    }
}

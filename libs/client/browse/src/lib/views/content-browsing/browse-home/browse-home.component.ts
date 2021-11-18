import { Component, OnInit } from '@angular/core';
import { DragonfishNetworkService } from '@dragonfish/client/services';
import { ContentModel } from '@dragonfish/shared/models/content';
import { AppQuery } from '@dragonfish/client/repository/app';
import { Constants, setTwoPartTitle } from '@dragonfish/shared/constants';

@Component({
    selector: 'dragonfish-browse-home',
    templateUrl: './browse-home.component.html'
})
export class BrowseHomeComponent implements OnInit {
    loadingNew = false;
    newWorks: ContentModel[];

    constructor(private network: DragonfishNetworkService, private app: AppQuery) {}

    ngOnInit(): void {
        setTwoPartTitle(Constants.BROWSE);
        this.loadFirstNew();
    }

    loadFirstNew() {
        this.loadingNew = true;
        this.network.fetchFirstNew(this.app.filter).subscribe(result => {
            this.newWorks = result;
            this.loadingNew = false;
        }, () => {
            this.loadingNew = false;
        });
    }
}

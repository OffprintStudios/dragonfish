import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { AlertsService } from '@dragonfish/client/alerts';
import { ContentModel } from '@dragonfish/shared/models/content';
import { DragonfishNetworkService } from '@dragonfish/client/services';
import { Constants, setTwoPartTitle } from '@dragonfish/shared/constants';
import { AppQuery } from '@dragonfish/client/repository/app';
import { isMobile } from '@dragonfish/shared/functions';
import { TAGS_ENABLED } from '@dragonfish/shared/constants/content-constants';

@Component({
    selector: 'dragonfish-browse',
    templateUrl: './browse.component.html',
    styleUrls: ['./browse.component.scss']
})
export class BrowseComponent implements OnInit {
    tagsEnabled = TAGS_ENABLED;

    loadingNew = false;
    newWorks: ContentModel[];
    searchForm = new FormGroup({
        query: new FormControl('')
    });
    mobileMode = false;

    constructor(
        public route: ActivatedRoute,
        private router: Router,
        private alerts: AlertsService,
        private network: DragonfishNetworkService,
        private appQuery: AppQuery,
    ) {}

    ngOnInit() {
        this.setTitle();
        this.loadFirstNew();
        this.onResize();
    }

    loadFirstNew() {
        this.loadingNew = true;
        this.network.fetchFirstNew(this.appQuery.filter).subscribe({
            next: (result) => {
                this.newWorks = result;
                this.loadingNew = false;
            },
            error: () => {
                this.loadingNew = false;
            }
        });
    }

    setTitle() {
        setTwoPartTitle(Constants.BROWSE);
    }
    
    @HostListener('window:resize', ['$event'])
    onResize() {
        this.mobileMode = isMobile();
    }
}

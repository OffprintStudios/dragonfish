import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { AlertsService } from '@dragonfish/client/alerts';
import { ContentModel } from '@dragonfish/shared/models/content';
import { DragonfishNetworkService } from '@dragonfish/client/services';
import { Constants, setTwoPartTitle } from '@dragonfish/shared/constants';
import { AppQuery } from '@dragonfish/client/repository/app';
import { isMobile } from '@dragonfish/shared/functions';

@Component({
    selector: 'dragonfish-browse',
    templateUrl: './browse.component.html',
    styleUrls: ['./browse.component.scss']
})
export class BrowseComponent implements OnInit {
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
        setTwoPartTitle(Constants.BROWSE);
        this.loadFirstNew();
        this.onResize();
    }

    loadFirstNew() {
        this.loadingNew = true;
        this.network.fetchFirstNew(this.appQuery.filter).subscribe(result => {
            this.newWorks = result;
            this.loadingNew = false;
        }, () => {
            this.loadingNew = false;
        });
    }

    submitSearch() {
        this.router.navigate(['search'], {
            relativeTo: this.route,
            queryParams: { query: this.searchForm.controls.query.value },
            queryParamsHandling: 'merge',
        }).catch(() => {
            this.alerts.error(`Something went wrong! Try again in a little bit.`);
        });
    }
    
    @HostListener('window:resize', ['$event'])
    onResize() {
        this.mobileMode = isMobile();
    }
}

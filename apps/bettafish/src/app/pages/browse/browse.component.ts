import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { AlertsService } from '@dragonfish/client/alerts';

@Component({
    selector: 'dragonfish-browse',
    templateUrl: './browse.component.html',
    styleUrls: ['./browse.component.scss']
})
export class BrowseComponent {
    searchForm = new FormGroup({
        query: new FormControl('')
    });

    constructor(private route: ActivatedRoute, private router: Router, private alerts: AlertsService) {}

    submitSearch() {
        this.router.navigate(['search'], {
            relativeTo: this.route,
            queryParams: { query: this.searchForm.controls.query.value },
            queryParamsHandling: 'merge',
        }).catch(() => {
            this.alerts.error(`Something went wrong! Try again in a little bit.`);
        });
    }
}

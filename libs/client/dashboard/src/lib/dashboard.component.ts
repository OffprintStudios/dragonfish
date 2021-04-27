import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
    selector: 'dragonfish-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
    currRoute = `Overview`;

    constructor(private router: Router) {}

    ngOnInit(): void {
        this.router.events.pipe(untilDestroyed(this)).subscribe(event => {
            if (event instanceof NavigationEnd) {
                const thisRoute = event.url.split('/').pop();
                switch (thisRoute) {
                    case 'overview':
                        this.currRoute = `Overview`;
                        break;
                    case 'approval-queue':
                        this.currRoute = `Approval Queue`;
                        break;
                    case 'group-queue':
                        this.currRoute = `Group Queue`;
                        break;
                    case 'reports':
                        this.currRoute = `Reports`;
                        break;
                    case 'users-management':
                        this.currRoute = `Users`;
                        break;
                    case 'audit-log':
                        this.currRoute = `Audit Log`;
                        break;
                }
            }
        })
    }
}

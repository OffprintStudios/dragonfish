import { Component } from '@angular/core';
import { PortfolioQuery } from '@dragonfish/client/repository/portfolio';
import { SessionQuery } from '@dragonfish/client/repository/session';

@Component({
    selector: 'dragonfish-portfolio-toolbar',
    templateUrl: './portfolio-toolbar.component.html',
    styleUrls: ['./portfolio-toolbar.component.scss']
})
export class PortfolioToolbarComponent {
    constructor(public sessionQuery: SessionQuery, public portfolioQuery: PortfolioQuery) {}
}

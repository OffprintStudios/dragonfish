import { Component } from '@angular/core';
import { Constants } from '@dragonfish/shared/constants';
import { slogans } from '../../models/site';

@Component({
    selector: 'dragonfish-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent {
    rotatingSlogan = slogans[Math.floor(Math.random() * slogans.length)];
    siteVersion = Constants.SITE_VERSION;
}

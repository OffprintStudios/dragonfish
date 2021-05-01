import { Component } from '@angular/core';
import { slogans } from '../../../models/site';
import { Constants } from '@dragonfish/shared/constants';

@Component({
    selector: 'dragonfish-auth-full',
    templateUrl: './auth-full.component.html',
    styleUrls: ['./auth-full.component.scss']
})
export class AuthFullComponent {
    rotatingSlogan = slogans[Math.floor(Math.random() * slogans.length)];
    siteVersion = Constants.SITE_VERSION;
}

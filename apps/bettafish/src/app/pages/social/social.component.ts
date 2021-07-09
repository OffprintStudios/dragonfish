import { Component, OnInit } from '@angular/core';
import { Constants, setTwoPartTitle } from '@dragonfish/shared/constants';

@Component({
    selector: 'dragonfish-social',
    templateUrl: './social.component.html',
    styleUrls: ['./social.component.scss']
})
export class SocialComponent implements OnInit {
    ngOnInit() {
        setTwoPartTitle(Constants.SOCIAL);
    }
}

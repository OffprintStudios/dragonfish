import { Component, OnInit } from '@angular/core';
import { setThreePartTitle, Constants } from '@dragonfish/shared/constants';

@Component({
    selector: 'dragonfish-read-it-later',
    templateUrl: './read-it-later.component.html',
})
export class ReadItLaterComponent implements OnInit {
    ngOnInit(): void {
        setThreePartTitle(Constants.MY_LIBRARY, Constants.READ_IT_LATER);
    }
}

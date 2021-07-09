import { Component, OnInit } from '@angular/core';
import { Constants, setTwoPartTitle } from '@dragonfish/shared/constants';

@Component({
    selector: 'dragonfish-about-offprint',
    templateUrl: './about-offprint.component.html',
})
export class AboutOffprintComponent implements OnInit {
    ngOnInit(): void {
        setTwoPartTitle(Constants.ABOUT);
    }
}

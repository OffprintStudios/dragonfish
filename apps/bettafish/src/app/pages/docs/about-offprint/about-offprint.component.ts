import { Component, OnInit } from '@angular/core';
import { Constants, setTwoPartTitle } from '@dragonfish/shared/constants';

@Component({
    selector: 'about-offprint',
    templateUrl: './about-offprint.component.html',
})
export class AboutOffprintComponent implements OnInit {
    constructor() {}

    ngOnInit(): void {
        setTwoPartTitle(Constants.ABOUT);
    }
}

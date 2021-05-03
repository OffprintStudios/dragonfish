import { Component, OnInit } from '@angular/core';
import { Constants, setTwoPartTitle } from '@dragonfish/shared/constants';

@Component({
    selector: 'omnibus',
    templateUrl: './omnibus.component.html',
})
export class OmnibusComponent implements OnInit {
    constructor() {}

    ngOnInit(): void {
        setTwoPartTitle(Constants.OMNIBUS);
    }
}

import { Component, OnInit } from '@angular/core';
import { Constants, setTwoPartTitle } from '@dragonfish/shared/constants';

@Component({
    selector: 'tos-component',
    templateUrl: './tos.component.html',
})
export class TosComponent implements OnInit {
    constructor() {}

    ngOnInit(): void {
        setTwoPartTitle(Constants.TOS);
    }
}

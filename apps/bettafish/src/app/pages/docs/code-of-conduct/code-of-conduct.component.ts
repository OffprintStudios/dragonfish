import { Component, OnInit } from '@angular/core';
import { Constants, setTwoPartTitle } from '@dragonfish/shared/constants';

@Component({
    selector: 'code-of-conduct',
    templateUrl: './code-of-conduct.component.html',
})
export class CodeOfConductComponent implements OnInit {
    constructor() {}

    ngOnInit(): void {
        setTwoPartTitle(Constants.CODE_OF_CONDUCT);
    }
}

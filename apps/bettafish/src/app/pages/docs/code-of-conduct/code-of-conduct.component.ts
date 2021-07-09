import { Component, OnInit } from '@angular/core';
import { Constants, setTwoPartTitle } from '@dragonfish/shared/constants';

@Component({
    selector: 'dragonfish-code-of-conduct',
    templateUrl: './code-of-conduct.component.html',
})
export class CodeOfConductComponent implements OnInit {
    ngOnInit(): void {
        setTwoPartTitle(Constants.CODE_OF_CONDUCT);
    }
}

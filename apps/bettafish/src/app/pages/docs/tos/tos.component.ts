import { Component, OnInit } from '@angular/core';
import { Constants, setTwoPartTitle } from '@dragonfish/shared/constants';

@Component({
    selector: 'dragonfish-tos-component',
    templateUrl: './tos.component.html',
})
export class TosComponent implements OnInit {
    ngOnInit(): void {
        setTwoPartTitle(Constants.TOS);
    }
}

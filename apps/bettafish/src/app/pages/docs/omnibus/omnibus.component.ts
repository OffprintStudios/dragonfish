import { Component, OnInit } from '@angular/core';
import { Constants, setTwoPartTitle } from '@dragonfish/shared/constants';

@Component({
    selector: 'dragonfish-omnibus',
    templateUrl: './omnibus.component.html',
})
export class OmnibusComponent implements OnInit {
    ngOnInit(): void {
        setTwoPartTitle(Constants.OMNIBUS);
    }
}

import { Component, OnInit } from '@angular/core';
import { setThreePartTitle, Constants } from '@dragonfish/shared/constants';

@Component({
    selector: 'dragonfish-finished-works',
    templateUrl: './finished-works.component.html',
})
export class FinishedWorksComponent implements OnInit {
    ngOnInit(): void {
        setThreePartTitle(Constants.MY_LIBRARY, Constants.FINISHED_WORKS);
    }
}

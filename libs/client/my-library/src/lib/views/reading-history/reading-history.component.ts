import { Component, OnInit } from '@angular/core';
import { setThreePartTitle, Constants } from '@dragonfish/shared/constants';

@Component({
    selector: 'dragonfish-reading-history',
    templateUrl: './reading-history.component.html',
})
export class ReadingHistoryComponent implements OnInit {
    ngOnInit(): void {
        setThreePartTitle(Constants.MY_LIBRARY, Constants.READING_HISTORY);
    }
}

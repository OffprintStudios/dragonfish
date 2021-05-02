import { Component } from '@angular/core';
import { Constants, setTwoPartTitle } from '@dragonfish/shared/constants';

@Component({
    selector: 'dragonfish-portfolio-settings',
    templateUrl: './portfolio-settings.component.html'
})
export class PortfolioSettingsComponent {
    ngOnInit() {
        setTwoPartTitle(Constants.SETTINGS);
    }
}

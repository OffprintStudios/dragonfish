import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { User } from '../../shared/user';

import { NagBarService } from '../../modules/nag-bar';

@Component({
    selector: 'app-new-policy-nag',
    templateUrl: './new-policy-nag.component.html',
    styleUrls: ['./new-policy-nag.component.less'],
})
export class NewPolicyNagComponent implements OnInit {
    loading = false;

    constructor(private nagBarService: NagBarService, private store: Store) {}

    ngOnInit(): void {}

    onSubmitClicked(): void {
        // set agree locally and with the server, then close the bar
        this.loading = true;

        this.store.dispatch(new User.AgreeToPolicies()).subscribe(
            () => {
                this.loading = false;
                this.nagBarService.clearCurrentConent();
            },
            (err) => {
                this.loading = false;
            },
        );
    }
}

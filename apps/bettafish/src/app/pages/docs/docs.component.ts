import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Select } from '@ngxs/store';
import { UserState } from '@dragonfish/client/repository/user';
import { Observable } from 'rxjs';
import { FrontendUser } from '@dragonfish/shared/models/users';

@Component({
    selector: 'dragonfish-docs',
    templateUrl: './docs.component.html',
    styleUrls: ['./docs.component.scss']
})
export class DocsComponent {
    @Select(UserState.currUser) currentUser$: Observable<FrontendUser>;

    constructor(public route: ActivatedRoute) {}
}

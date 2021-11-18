import { Component } from '@angular/core';
import { SessionQuery } from '@dragonfish/client/repository/session';
import { PseudonymsQuery } from '@dragonfish/client/repository/pseudonyms';

@Component({
    selector: 'dragonfish-browse',
    templateUrl: './browse.component.html',
})
export class BrowseComponent {
    constructor(public session: SessionQuery, public profiles: PseudonymsQuery) {}
}

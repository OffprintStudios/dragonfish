import { Component, Input, OnInit } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { ProfileQuery } from '../../repo';

@Component({
    selector: 'dragonfish-profile-topbar',
    templateUrl: './profile-topbar.component.html',
    styleUrls: ['./profile-topbar.component.scss'],
    animations: [
        trigger('inOutBig', [
            transition(':enter', [
                style({ height: '*', opacity: 0 }),
                animate('.250s ease-in', style({ height: '26.25rem', opacity: 1 })),
            ]),
            transition(':leave', [
                style({ height: '7.5rem', opacity: 1 }),
                animate('.250s ease-out', style({ height: 0, opacity: 0 })),
            ]),
        ]),
    ],
})
export class ProfileTopbarComponent implements OnInit {
    @Input() scrolled = false;

    constructor(public profileQuery: ProfileQuery) {}

    ngOnInit() {}
}

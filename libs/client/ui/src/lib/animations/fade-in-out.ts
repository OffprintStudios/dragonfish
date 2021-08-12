import { trigger, state, style, transition, animate } from '@angular/animations';

export const fadeInOut = trigger('fadeInOut', [
    state('in', style({ opacity: 1 })),
    transition(':enter', [style({ opacity: 0 }), animate(200)]),
    transition(':leave', animate(200, style({ opacity: 0 }))),
]);

import { trigger, transition, style, animate } from '@angular/animations';

export const slideInOut = trigger('slideInOut', [
    transition(':enter', [
        style({ transform: 'translateX(-100%)' }),
        animate('200ms ease-in', style({ transform: 'translateX(0%)' })),
    ]),
    transition(':leave', [animate('200ms ease-in', style({ transform: 'translateX(-100%)' }))]),
]);

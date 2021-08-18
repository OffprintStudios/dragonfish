import { query, style, group, animate } from '@angular/animations';

export const moveLeft = [
    query(':enter, :leave', style({ position: 'fixed', width: '100%' }), { optional: true }),
    group([
        query(
            ':enter',
            [
                style({ transform: 'translateX(-100%)' }),
                animate('.3s ease-out', style({ transform: 'translateX(0%)' })),
            ],
            {
                optional: true,
            },
        ),
        query(
            ':leave',
            [style({ transform: 'translateX(0%)' }), animate('.3s ease-out', style({ transform: 'translateX(100%)' }))],
            {
                optional: true,
            },
        ),
    ]),
];

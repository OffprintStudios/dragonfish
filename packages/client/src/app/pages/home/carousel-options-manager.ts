import { NguCarouselConfig } from '@ngu/carousel';

export class CarouselOptionsManager {
    private newsConfig: NguCarouselConfig = {
        grid: {xs: 1, sm: 1, md: 3, lg: 3, all: 0},
        slide: 3,
        speed: 250,
        point: {
            visible: true
        },
        load: 2,
        velocity: 0,
        touch: true,
        easing: 'cubic-bezier(0, 0, 0.2, 1)'
    };

    public get newsCarouselConfig() { return this.newsConfig; }
}
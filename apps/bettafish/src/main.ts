import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { persistState } from '@datorama/akita';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
    enableProdMode();
}

const storage = persistState({
    include: [
        'session',
        'portfolio',
        'app',
    ],
});

const providers = [
    { provide: 'persistStorage', useValue: storage },
];

platformBrowserDynamic(providers)
    .bootstrapModule(AppModule)
    .catch((err) => console.error(err));
